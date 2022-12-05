import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { ClassCreateDto } from '../dtos/class.create.dto';
import { ClassRepository } from '../../infra/repositories/class.repository';
import { Class } from '../../domain/entities/class.entity';
import { CheckClassUseCase } from './class.check-class-restrictions.use-case';
import { FindByIdGroupUseCase } from '../../../group/application/useCases';
import { FindAllWeekUseCase } from '../../../week/application/useCases';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { FindByIdLessonUseCase } from '../../../lesson/application/useCases';

export type CreateClassUseCaseResponse = Either<AppError.UnexpectedErrorResult<Class>
  | AppError.ValidationErrorResult<Class>,
  Result<Class>>;

@Injectable()
export class CreateClassUseCase implements IUseCase<ClassCreateDto, Promise<CreateClassUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly classRepository: ClassRepository,
    private readonly checkClass: CheckClassUseCase,
    private readonly groupFindOne: FindByIdGroupUseCase,
    private readonly weekFindAll: FindAllWeekUseCase,
    private readonly findLesson: FindByIdLessonUseCase,
  ) {
    this._logger = new Logger('CreateClassUseCase');
  }

  async execute(request: ClassCreateDto, persist: boolean = true): Promise<CreateClassUseCaseResponse> {
    this._logger.log('Executing...');

    const group = await this.groupFindOne.execute({ id: request.groupId.id });

    if (group.isRight())
      request.color = group.value.unwrap().color;

    const week = await this.weekFindAll.execute({
      filter: {
        firstDate: LessThanOrEqual(request.start),
        endDate: MoreThanOrEqual(request.end),
      },
    });

    let weekId = undefined;
    if (week.isRight() && week.value.unwrap().items.length > 0)
      weekId = { id: week.value.unwrap().items[0]._id.toString() };

    const lesson = await this.findLesson.execute({ id: request.lessonId.id });

    if (lesson.isRight() && lesson.value.unwrap().teacherId.id)
      request.teacherIds.push(lesson.value.unwrap().teacherId);

    const classOrError: Result<Class> = Class.New({ ...request, weekId });

    if (classOrError.isFailure)
      return left(classOrError);

    const c: Class = classOrError.unwrap();

    const check = await this.checkClass.execute({
      _class: c,
      year: group.value.unwrap().year,
    });

    if (check.isLeft())
      return check;

    try {
      if (persist)
        await this.classRepository.save(c);

      return right(Result.Ok(c));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
