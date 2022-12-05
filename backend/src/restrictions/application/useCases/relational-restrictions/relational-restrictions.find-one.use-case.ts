import { AppError } from 'src/shared/core/errors/AppError';
import { Either, left, right } from '../../../../shared/core/Either';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import Optional from '../../../../shared/core/Option';
import { RelationalRestrictions } from '../../../domain/entities/RelationalRequirement';
import { RelationalRestrictionsRepository } from '../../../infra/repositories/relational-restriction.repository';

export type FindByIdRelationalRestrictionUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<RelationalRestrictions>
    | AppError.ValidationErrorResult<RelationalRestrictions>
    | AppError.ObjectNotExistResult<RelationalRestrictions>,
    Result<RelationalRestrictions>>;

@Injectable()
export class FindByIdRelationalRestrictionUseCase implements IUseCase<{ id: string }, Promise<FindByIdRelationalRestrictionUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly countConditionRestrictionRepository: RelationalRestrictionsRepository) {
    this._logger = new Logger('FindByIdCountConditionRestrictionUseCase');
  }

  async execute(request: {
    id: string
  }): Promise<FindByIdRelationalRestrictionUseCaseResponse> {
    try {
      return Optional(await this.countConditionRestrictionRepository.findById(request.id))
        .okOr(new AppError.ObjectNotExist(`CountConditionRestriction with id ${request.id} doesn't exist`))
        .mapOrElse(
          //if error
          (err: AppError.ObjectNotExist) =>
            left(Result.Fail(err)),
          //if ok
          (countConditionRestriction: RelationalRestrictions) =>
            right(Result.Ok(countConditionRestriction)),
        );

    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
