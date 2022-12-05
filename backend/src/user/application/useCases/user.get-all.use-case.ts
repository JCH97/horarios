import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { User } from '../../domain/entities/user.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { UserRepository } from '../../infra/repositories/user.repository';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { UserFindAllDto } from '../dtos/user.find-all.dto';

export type FindAllUserUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<User>>
    | AppError.ValidationErrorResult<FindAllResult<User>>
    | AppError.ObjectNotExistResult<FindAllResult<User>>,
    Result<FindAllResult<User>>>;

@Injectable()
export class FindAllUserUseCase implements IUseCase<UserFindAllDto, Promise<FindAllUserUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly userRepository: UserRepository) {
    this._logger = new Logger('FindAllUserUseCase');
  }

  async execute(request: UserFindAllDto): Promise<FindAllUserUseCaseResponse> {
    try {
      const ans = await this.userRepository.findAll(request.filter);
      return right(Result.Ok(ans));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
