import { SimpleCountRestrictions } from 'src/restrictions/domain/entities/simple-count-restriction.entity';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import {
  SimpleCountRestrictionsRepository,
} from '../../../infra/repositories/simple-count-restrictions-repository.service';
import Optional from '../../../../shared/core/Option';

export type RemoveSimpleCountRestrictionsUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<SimpleCountRestrictions>
    | AppError.ValidationErrorResult<SimpleCountRestrictions>
    | AppError.ObjectNotExistResult<SimpleCountRestrictions>,
    Result<SimpleCountRestrictions>>;

@Injectable()
export class RemoveSimpleCountRestrictionsUseCase implements IUseCase<{ id: string }, Promise<RemoveSimpleCountRestrictionsUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly simpleCountRestrictionsRepository: SimpleCountRestrictionsRepository) {
    this._logger = new Logger('RemoveSimpleCountRestrictionsUseCase');
  }

  async execute(request: { id: string }): Promise<RemoveSimpleCountRestrictionsUseCaseResponse> {
    const simpleCountRestrictions = Optional(await this.simpleCountRestrictionsRepository.findById(request.id));

    if (simpleCountRestrictions.isNone())
      return left(Result.Fail(new AppError.ObjectNotExist(`SimpleCountRestrictions with id ${request.id} doesn't exist`)));

    try {
      await this.simpleCountRestrictionsRepository.drop(simpleCountRestrictions.unwrap());
      return right(Result.Ok(simpleCountRestrictions.unwrap()));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
