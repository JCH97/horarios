import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Lesson } from '../../domain/entities/lesson.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { LessonRepository } from '../../infra/repositories/lesson.repository';
import { LessonCreateDto } from '../dtos/lesson.create.dto';

export type CreateLessonUseCaseResponse = Either<AppError.UnexpectedErrorResult<Lesson>
  | AppError.ValidationErrorResult<Lesson>,
  Result<Lesson>>;

@Injectable()
export class CreateLessonUseCase implements IUseCase<LessonCreateDto, Promise<CreateLessonUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly lessonRepository: LessonRepository,
  ) {
    this._logger = new Logger('CreateLessonUseCase');
  }

  async execute(request: LessonCreateDto): Promise<CreateLessonUseCaseResponse> {
    this._logger.log('Executing...');

    const lessonOrError: Result<Lesson> = Lesson.New({ ...request });

    if (lessonOrError.isFailure)
      return left(lessonOrError);

    const lesson: Lesson = lessonOrError.unwrap();
    try {
      await this.lessonRepository.save(lesson);

      return right(Result.Ok(lesson));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
