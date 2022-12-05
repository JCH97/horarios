import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import Optional from '../../../../shared/core/Option';
import { DistributionRestrictions } from '../../../domain/entities/distribution-restriction.entity';
import { AppError } from '../../../../shared/core/errors/AppError';
import { Either, left, right } from '../../../../shared/core/Either';
import { DistributionRestrictionsRepository } from '../../../infra/repositories/distribution-restrictions.repository';

export type RemoveDistributionRestrictionsUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<DistributionRestrictions>
    | AppError.ValidationErrorResult<DistributionRestrictions>
    | AppError.ObjectNotExistResult<DistributionRestrictions>,
    Result<DistributionRestrictions>>;

@Injectable()
export class RemoveDistributionRestrictionsUseCase implements IUseCase<{ id: string }, Promise<RemoveDistributionRestrictionsUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly distributionRestrictionsRepository: DistributionRestrictionsRepository) {
    this._logger = new Logger('RemoveDistributionRestrictionsUseCase');
  }

  async execute(request: { id: string }): Promise<RemoveDistributionRestrictionsUseCaseResponse> {
    const distributionRestrictions = Optional(await this.distributionRestrictionsRepository.findById(request.id));

    if (distributionRestrictions.isNone())
      return left(Result.Fail(new AppError.ObjectNotExist(`DistributionRestrictions with id ${request.id} doesn't exist`)));

    try {
      await this.distributionRestrictionsRepository.drop(distributionRestrictions.unwrap());
      return right(Result.Ok(distributionRestrictions.unwrap()));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
