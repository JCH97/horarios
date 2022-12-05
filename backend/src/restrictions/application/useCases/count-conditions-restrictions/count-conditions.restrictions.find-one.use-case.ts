import { AppError } from 'src/shared/core/errors/AppError';
import { Either, left, right } from '../../../../shared/core/Either';
import { Result } from '../../../../shared/core/Result';
import { CountConditionsRestrictions } from '../../../domain/entities/count-conditions.restrictions.entity';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import {
  CountConditionsRestrictionsRepository,
} from '../../../infra/repositories/count-conditions.restrictions.repository';
import Optional from '../../../../shared/core/Option';

export type FindByIdCountConditionRestrictionUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<CountConditionsRestrictions>
    | AppError.ValidationErrorResult<CountConditionsRestrictions>
    | AppError.ObjectNotExistResult<CountConditionsRestrictions>,
    Result<CountConditionsRestrictions>>;

@Injectable()
export class FindByIdCountConditionRestrictionUseCase implements IUseCase<{ id: string }, Promise<FindByIdCountConditionRestrictionUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly countConditionRestrictionRepository: CountConditionsRestrictionsRepository) {
    this._logger = new Logger('FindByIdCountConditionRestrictionUseCase');
  }

  async execute(request: {
    id: string
  }): Promise<FindByIdCountConditionRestrictionUseCaseResponse> {
    try {
      return Optional(await this.countConditionRestrictionRepository.findById(request.id))
        .okOr(new AppError.ObjectNotExist(`CountConditionRestriction with id ${request.id} doesn't exist`))
        .mapOrElse(
          //if error
          (err: AppError.ObjectNotExist) =>
            left(Result.Fail(err)),
          //if ok
          (countConditionRestriction: CountConditionsRestrictions) =>
            right(Result.Ok(countConditionRestriction)),
        );

    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
