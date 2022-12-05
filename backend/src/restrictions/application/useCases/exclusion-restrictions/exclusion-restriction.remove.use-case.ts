import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import Optional from '../../../../shared/core/Option';
import { ExclusionRestrictions } from '../../../domain/entities/exclusion-restriction.entity';
import { AppError } from '../../../../shared/core/errors/AppError';
import { Either, left, right } from '../../../../shared/core/Either';
import { ExclusionRestrictionsRepository } from '../../../infra/repositories/exclusion-restriction.repository';

export type RemoveExclusionRestrictionsUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<ExclusionRestrictions>
    | AppError.ValidationErrorResult<ExclusionRestrictions>
    | AppError.ObjectNotExistResult<ExclusionRestrictions>,
    Result<ExclusionRestrictions>>;

@Injectable()
export class RemoveExclusionRestrictionsUseCase implements IUseCase<{ id: string }, Promise<RemoveExclusionRestrictionsUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly exclusionRestrictionsRepository: ExclusionRestrictionsRepository) {
    this._logger = new Logger('RemoveExclusionRestrictionsUseCase');
  }

  async execute(request: { id: string }): Promise<RemoveExclusionRestrictionsUseCaseResponse> {
    const exclusionRestrictions = Optional(await this.exclusionRestrictionsRepository.findById(request.id));

    if (exclusionRestrictions.isNone())
      return left(Result.Fail(new AppError.ObjectNotExist(`ExclusionRestrictions with id ${request.id} doesn't exist`)));

    try {
      await this.exclusionRestrictionsRepository.drop(exclusionRestrictions.unwrap());
      return right(Result.Ok(exclusionRestrictions.unwrap()));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
