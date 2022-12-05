import { AppError } from 'src/shared/core/errors/AppError';
import { Either, left, right } from '../../../../shared/core/Either';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import Optional from '../../../../shared/core/Option';
import { ExclusionRestrictions } from 'src/restrictions/domain/entities/exclusion-restriction.entity';
import { ExclusionRestrictionsRepository } from '../../../infra/repositories/exclusion-restriction.repository';

export type FindByIdExclusionRestrictionUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<ExclusionRestrictions>
    | AppError.ValidationErrorResult<ExclusionRestrictions>
    | AppError.ObjectNotExistResult<ExclusionRestrictions>,
    Result<ExclusionRestrictions>>;

@Injectable()
export class FindByIdExclusionRestrictionUseCase implements IUseCase<{ id: string }, Promise<FindByIdExclusionRestrictionUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly simpleConditionRestrictionRepository: ExclusionRestrictionsRepository) {
    this._logger = new Logger('FindByIdExclusionRestrictionUseCase');
  }

  async execute(request: {
    id: string
  }): Promise<FindByIdExclusionRestrictionUseCaseResponse> {
    try {
      return Optional(await this.simpleConditionRestrictionRepository.findById(request.id))
        .okOr(new AppError.ObjectNotExist(`ExclusionRestriction with id ${request.id} doesn't exist`))
        .mapOrElse(
          //if error
          (err: AppError.ObjectNotExist) =>
            left(Result.Fail(err)),
          //if ok
          (simpleConditionRestriction: ExclusionRestrictions) =>
            right(Result.Ok(simpleConditionRestriction)),
        );

    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
