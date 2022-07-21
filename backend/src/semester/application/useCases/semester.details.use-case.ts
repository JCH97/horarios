import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Semester } from '../../../semester/domain/entities/semester.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { SemesterRepository } from '../../../semester/infra/repositories/semester.repository';
import Optional from '../../../shared/core/Option';

export type FindDetailsSemesterUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<Semester>
    | AppError.ValidationErrorResult<Semester>
    | AppError.ObjectNotExistResult<Semester>,
    Result<Semester>>;

@Injectable()
export class FindDetailsSemesterUseCase implements IUseCase<{ id: string }, Promise<FindDetailsSemesterUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly semesterRepository: SemesterRepository) {
    this._logger = new Logger('FindDetailsSemesterUseCase');
  }

  async execute(request: {
    id: string
  }): Promise<FindDetailsSemesterUseCaseResponse> {
    try {
      return Optional(await this.semesterRepository.findDetails(request.id))
        .okOr(new AppError.ObjectNotExist(`Semester with id ${request.id} doesn't exist`))
        .mapOrElse(
          //if error
          (err: AppError.ObjectNotExist) =>
            left(Result.Fail(err)),
          //if ok
          (semester: Semester) =>
            right(Result.Ok(semester)),
        );

    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
