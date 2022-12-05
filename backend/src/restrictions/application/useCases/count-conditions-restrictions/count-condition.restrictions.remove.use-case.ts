import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import Optional from '../../../../shared/core/Option';
import { CountConditionsRestrictions } from 'src/restrictions/domain/entities/count-conditions.restrictions.entity';
import {
  CountConditionsRestrictionsRepository
} from '../../../infra/repositories/count-conditions.restrictions.repository';

export type RemoveCountConditionsRestrictionsUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<CountConditionsRestrictions>
    | AppError.ValidationErrorResult<CountConditionsRestrictions>
    | AppError.ObjectNotExistResult<CountConditionsRestrictions>,
    Result<CountConditionsRestrictions>>;

@Injectable()
export class RemoveCountConditionsRestrictionsUseCase implements IUseCase<{ id: string }, Promise<RemoveCountConditionsRestrictionsUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly countConditionsRestrictionsRepository: CountConditionsRestrictionsRepository) {
    this._logger = new Logger('RemoveCountConditionsRestrictionsUseCase');
  }

  async execute(request: { id: string }): Promise<RemoveCountConditionsRestrictionsUseCaseResponse> {
    const countConditionsRestrictions = Optional(await this.countConditionsRestrictionsRepository.findById(request.id));

    if (countConditionsRestrictions.isNone())
      return left(Result.Fail(new AppError.ObjectNotExist(`CountConditionsRestrictions with id ${request.id} doesn't exist`)));

    try {
      await this.countConditionsRestrictionsRepository.drop(countConditionsRestrictions.unwrap());
      return right(Result.Ok(countConditionsRestrictions.unwrap()));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
