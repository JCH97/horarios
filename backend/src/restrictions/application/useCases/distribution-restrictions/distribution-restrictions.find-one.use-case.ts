import { AppError } from 'src/shared/core/errors/AppError';
import { Either, left, right } from '../../../../shared/core/Either';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import Optional from '../../../../shared/core/Option';
import { DistributionRestrictions } from 'src/restrictions/domain/entities/distribution-restriction.entity';
import { DistributionRestrictionsRepository } from '../../../infra/repositories/distribution-restrictions.repository';

export type FindByIdDistributionRestrictionUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<DistributionRestrictions>
    | AppError.ValidationErrorResult<DistributionRestrictions>
    | AppError.ObjectNotExistResult<DistributionRestrictions>,
    Result<DistributionRestrictions>>;

@Injectable()
export class FindByIdDistributionRestrictionUseCase implements IUseCase<{ id: string }, Promise<FindByIdDistributionRestrictionUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly simpleConditionRestrictionRepository: DistributionRestrictionsRepository) {
    this._logger = new Logger('FindByIdDistributionRestrictionUseCase');
  }

  async execute(request: {
    id: string
  }): Promise<FindByIdDistributionRestrictionUseCaseResponse> {
    try {
      return Optional(await this.simpleConditionRestrictionRepository.findById(request.id))
        .okOr(new AppError.ObjectNotExist(`DistributionRestriction with id ${request.id} doesn't exist`))
        .mapOrElse(
          //if error
          (err: AppError.ObjectNotExist) =>
            left(Result.Fail(err)),
          //if ok
          (simpleConditionRestriction: DistributionRestrictions) =>
            right(Result.Ok(simpleConditionRestriction)),
        );

    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
