import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Result } from '../../../shared/core/Result';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { User } from 'src/user/domain/entities/user.entity';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserRepository } from 'src/user/infra/repositories/user.repository';
import { UserStatus } from '../../domain/enums/user.status';
import { UserPermissions } from '../../domain/enums/user.permissions';

export type CreateUserUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
  | AppError.ValidationErrorResult<User>,
  Result<User>>;

@Injectable()
export class CreateUserUseCase implements IUseCase<UserCreateDto, Promise<CreateUserUseCaseResponse>>, OnModuleInit {

  private _logger: Logger;

  constructor(private readonly userRepository: UserRepository) {
    this._logger = new Logger('CreateUserUseCase');
  }

  async onModuleInit() {
    const exist = await this.userRepository.findOne({ email: 'admin@admin.com' });

    if (!exist) {
      const userAdmin: UserCreateDto = {
        username: 'admin',
        password: 'admin',
        email: 'admin@admin.com',
        status: UserStatus.Register,
        permissions: UserPermissions.ADMINISTER,
      };

      await this.execute(userAdmin);
    }
  }

  async execute(request: UserCreateDto): Promise<CreateUserUseCaseResponse> {
    this._logger.log('Executing...');

    let exist = await this.userRepository.findOne({ email: request.email });

    if (exist)
      return left(Result.Fail(new AppError.ValidationError('User already exist')));

    const userDomainOrError: Result<User> = User.New({
      username: request.username,
      password: request.password,
      permissions: request.permissions,
      email: request.email,
      status: request.status,
    });


    if (userDomainOrError.isFailure)
      return left(userDomainOrError);

    const user: User = userDomainOrError.unwrap();
    user.setPasswordHash(request.password);

    try {
      await this.userRepository.save(user);
      return right(Result.Ok(user));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}