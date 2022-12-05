import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import Optional from '../../../../shared/core/Option';
import { RelationalRestrictions } from 'src/restrictions/domain/entities/RelationalRequirement';
import { RelationalRestrictionsRepository } from '../../../infra/repositories/relational-restriction.repository';

export type RemoveRelationalRestrictionsUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<RelationalRestrictions>
    | AppError.ValidationErrorResult<RelationalRestrictions>
    | AppError.ObjectNotExistResult<RelationalRestrictions>,
    Result<RelationalRestrictions>>;

@Injectable()
export class RemoveRelationalRestrictionsUseCase implements IUseCase<{ id: string }, Promise<RemoveRelationalRestrictionsUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly relationalRestrictionsRepository: RelationalRestrictionsRepository) {
    this._logger = new Logger('RemoveRelationalRestrictionsUseCase');
  }

  async execute(request: { id: string }): Promise<RemoveRelationalRestrictionsUseCaseResponse> {
    const relationalRestrictions = Optional(await this.relationalRestrictionsRepository.findById(request.id));

    if (relationalRestrictions.isNone())
      return left(Result.Fail(new AppError.ObjectNotExist(`RelationalRestrictions with id ${request.id} doesn't exist`)));

    try {
      await this.relationalRestrictionsRepository.drop(relationalRestrictions.unwrap());
      return right(Result.Ok(relationalRestrictions.unwrap()));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
