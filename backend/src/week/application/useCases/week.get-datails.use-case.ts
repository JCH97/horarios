import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Week } from '../../../week/domain/entities/week.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { WeekRepository } from '../../../week/infra/repositories/week.repository';
import Optional from '../../../shared/core/Option';

export type FindDetailsWeekUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<Week>
    | AppError.ValidationErrorResult<Week>
    | AppError.ObjectNotExistResult<Week>,
    Result<Week>>;

@Injectable()
export class FindDetailsWeekUseCase implements IUseCase<{ id: string }, Promise<FindDetailsWeekUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly weekRepository: WeekRepository) {
    this._logger = new Logger('FindDetailsWeekUseCase');
  }

  async execute(request: {
    id: string
  }): Promise<FindDetailsWeekUseCaseResponse> {
    try {
      return Optional(await this.weekRepository.findDetails(request.id))
        .okOr(new AppError.ObjectNotExist(`Week with id ${request.id} doesn't exist`))
        .mapOrElse(
          //if error
          (err: AppError.ObjectNotExist) =>
            left(Result.Fail(err)),
          //if ok
          (week: Week) =>
            right(Result.Ok(week)),
        );

    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
