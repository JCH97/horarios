import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Semester } from '../../domain/entities/semester.entity';
import { Result } from '../../../shared/core/Result';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { Injectable, Logger } from '@nestjs/common';
import { SemesterCreateDto } from '../dtos/semester.create.dto';
import { SemesterRepository } from '../../infra/repositories/semester.repository';
import { CreateWeekBySemesterUseCase } from '../../../week/application/useCases';
import { FindAllSemesterUseCase } from './semester.get-all.use-case';
import { Between } from 'typeorm';

export type CreateSemesterUseCaseResponse = Either<AppError.UnexpectedErrorResult<Semester>
  | AppError.ValidationErrorResult<Semester>,
  Result<Semester>>;

@Injectable()
export class CreateSemesterUseCase implements IUseCase<SemesterCreateDto, Promise<CreateSemesterUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly semesterRepository: SemesterRepository,
    private readonly createWeeks: CreateWeekBySemesterUseCase,
    private readonly semesterOverlap: FindAllSemesterUseCase) {
    this._logger = new Logger('CreateSemesterUseCase');
  }

  async execute(request: SemesterCreateDto): Promise<CreateSemesterUseCaseResponse> {
    this._logger.log('Executing...');

    const ans = await this
      .semesterOverlap
      .execute({
        filter: {
          start: Between(request.start, request.end),
          end: Between(request.start, request.end),
        },
      });

    if (ans.isRight && ans.value.unwrap().items.length > 0)
      return left(Result.Fail(new AppError.UnexpectedError(new Error('Semester overlapping'))));

    request.start = new Date(request.start);
    request.end = new Date(request.end);

    const semesterDomainOrError: Result<Semester> = Semester.New({
      ...request,
    });

    if (semesterDomainOrError.isFailure)
      return left(semesterDomainOrError);

    const semester: Semester = semesterDomainOrError.unwrap();

    try {
      await this.semesterRepository.save(semester);

      await this.createWeeks.execute({
        semesterStart: request.start,
        semesterEnd: request.end,
        semesterId: { id: semester._id.toString() },
      });


      return right(Result.Ok(semester));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}