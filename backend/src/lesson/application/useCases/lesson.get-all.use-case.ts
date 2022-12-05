import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Lesson } from '../../domain/entities/lesson.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { LessonRepository } from '../../infra/repositories/lesson.repository';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { LessonFindAllDto } from '../dtos/lesson.find-all.dto';

export type FindAllLessonUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<Lesson>>
    | AppError.ValidationErrorResult<FindAllResult<Lesson>>
    | AppError.ObjectNotExistResult<FindAllResult<Lesson>>,
    Result<FindAllResult<Lesson>>>;

@Injectable()
export class FindAllLessonUseCase implements IUseCase<LessonFindAllDto, Promise<FindAllLessonUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly lessonRepository: LessonRepository) {
    this._logger = new Logger('FindAllLessonUseCase');
  }

  async execute(request: LessonFindAllDto): Promise<FindAllLessonUseCaseResponse> {
    try {
      const ans = await this.lessonRepository.findAll(request.filter);
      return right(Result.Ok(ans));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
