import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { User } from '../../domain/entities/user.entity';
import { Result } from '../../../shared/core/Result';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from 'src/user/infra/repositories/user.repository';
import { UserRemovePermissionDto } from '../dtos/user.remove-permission.dto';

export type UserRemovePermissionUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
  | AppError.ValidationErrorResult<User>,
  Result<User>>;

@Injectable()
export class UserRemovePermissionUseCase implements IUseCase<UserRemovePermissionDto, Promise<UserRemovePermissionUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly userRepository: UserRepository,
  ) {
    this._logger = new Logger('UserRemovePermissionUseCase');
  }

  async execute(request: UserRemovePermissionDto): Promise<UserRemovePermissionUseCaseResponse> {

    const user = await this.userRepository.findById(request.userId);

    if (user === null)
      return left(Result.Fail(new AppError.ValidationError('User not found')));

    user.RemovePermission(request.permission);

    await this.userRepository.save(user);

    return right(Result.Ok(user));
  }
}
