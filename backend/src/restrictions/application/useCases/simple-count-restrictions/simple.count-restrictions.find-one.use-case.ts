import { AppError } from 'src/shared/core/errors/AppError';
import { Either, left, right } from '../../../../shared/core/Either';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import Optional from '../../../../shared/core/Option';
import { SimpleCountRestrictions } from '../../../domain/entities/simple-count-restriction.entity';
import {
  SimpleCountRestrictionsRepository,
} from '../../../infra/repositories/simple-count-restrictions-repository.service';

export type FindByIdSimpleCountRestrictionUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<SimpleCountRestrictions>
    | AppError.ValidationErrorResult<SimpleCountRestrictions>
    | AppError.ObjectNotExistResult<SimpleCountRestrictions>,
    Result<SimpleCountRestrictions>>;

@Injectable()
export class FindByIdSimpleCountRestrictionUseCase implements IUseCase<{ id: string }, Promise<FindByIdSimpleCountRestrictionUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly simpleConditionRestrictionRepository: SimpleCountRestrictionsRepository) {
    this._logger = new Logger('FindByIdSimpleCountRestrictionUseCase');
  }

  async execute(request: {
    id: string
  }): Promise<FindByIdSimpleCountRestrictionUseCaseResponse> {
    try {
      return Optional(await this.simpleConditionRestrictionRepository.findById(request.id))
        .okOr(new AppError.ObjectNotExist(`SimpleCountRestriction with id ${request.id} doesn't exist`))
        .mapOrElse(
          //if error
          (err: AppError.ObjectNotExist) =>
            left(Result.Fail(err)),
          //if ok
          (simpleConditionRestriction: SimpleCountRestrictions) =>
            right(Result.Ok(simpleConditionRestriction)),
        );

    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
