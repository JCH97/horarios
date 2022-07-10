import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Major } from '../../domain/entities/major.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { MajorRepository } from '../../infra/repositories/major.repository';
import Optional from '../../../shared/core/Option';

export type FindDetailsMajorUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<Major>
    | AppError.ValidationErrorResult<Major>
    | AppError.ObjectNotExistResult<Major>,
    Result<Major>>;

@Injectable()
export class FindDetailsMajorUseCase implements IUseCase<{ id: string }, Promise<FindDetailsMajorUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly majorRepository: MajorRepository) {
    this._logger = new Logger('FindDetailsMajorUseCase');
  }

  async execute(request: {
    id: string
  }): Promise<FindDetailsMajorUseCaseResponse> {
    try {
      return Optional(await this.majorRepository.findDetails(request.id))
        .okOr(new AppError.ObjectNotExist(`Major with id ${request.id} doesn't exist`))
        .mapOrElse(
          //if error
          (err: AppError.ObjectNotExist) =>
            left(Result.Fail(err)),
          //if ok
          (major: Major) =>
            right(Result.Ok(major)),
        );

    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
