import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { Faculty } from '../../../faculty/domain/entities/faculty.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { FacultyFindAllDto } from '../../../faculty/application/dtos/faculty.find-all.dto';
import { FacultyRepository } from '../../../faculty/infra/repositories/faculty.repository';

export type FindAllFacultyUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<Faculty>>
    | AppError.ValidationErrorResult<FindAllResult<Faculty>>
    | AppError.ObjectNotExistResult<FindAllResult<Faculty>>,
    Result<FindAllResult<Faculty>>>;

@Injectable()
export class FindAllFacultyUseCase implements IUseCase<FacultyFindAllDto, Promise<FindAllFacultyUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly facultyRepository: FacultyRepository) {
    this._logger = new Logger('FindAllFacultyUseCase');
  }

  async execute(request: FacultyFindAllDto): Promise<FindAllFacultyUseCaseResponse> {
    try {
      const ans = await this.facultyRepository.findAll(request.filter);
      return right(Result.Ok(ans));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
