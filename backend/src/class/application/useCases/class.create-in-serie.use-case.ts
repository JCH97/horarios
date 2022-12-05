import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Result } from '../../../shared/core/Result';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { CreateClassUseCase } from './class.create.use-case';
import { ClassRepository } from '../../infra/repositories/class.repository';
import { FindAllWeekUseCase } from '../../../week/application/useCases';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { FindByIdSemesterUseCase } from '../../../semester/application/useCases';
import { ClassCreateInSerieDto } from '../dtos/class.create-in-serie.dto';
import { v4 } from 'uuid';
import { IUnitOfWork, IUnitOfWorkFactory } from '../../../shared/core/interfaces/IUnitOfWork';
import { IRepository, IRepositoryFactory } from '../../../shared/core/interfaces/IRepository';
import { Class } from '../../domain/entities/class.entity';
import { MultipleResponseDto } from '../dtos/create-multiple.response.dto';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { ClassFrequency } from '../../domain/enums/class-frecuency';

export type CreateMultipleClassUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<MultipleResponseDto>>
    | AppError.ValidationErrorResult<FindAllResult<MultipleResponseDto>>
    | AppError.ObjectNotExistResult<FindAllResult<MultipleResponseDto>>,
    Result<FindAllResult<MultipleResponseDto>>>;

@Injectable()
export class CreteMultipleClassInSameSerieUseCase implements IUseCase<ClassCreateInSerieDto, Promise<CreateMultipleClassUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly classRepository: ClassRepository,
    private readonly createClass: CreateClassUseCase,
    private readonly findWeek: FindAllWeekUseCase,
    private readonly findSemester: FindByIdSemesterUseCase,
    @Inject('IUnitOfWorkFactory') private readonly _unitOfWorkFact: IUnitOfWorkFactory,
    @Inject('IRepositoryClassFactory') private readonly repositoryFactory: IRepositoryFactory<Class, IRepository<Class>>,
  ) {
    this._logger = new Logger('CreateMultipleClassUseCase');
  }

  async execute(request: ClassCreateInSerieDto): Promise<CreateMultipleClassUseCaseResponse> {
    this._logger.log('Executing');

    const weeks = await this.findWeek.execute({
      filter: {
        firstDate: LessThanOrEqual(request.start),
        endDate: MoreThanOrEqual(request.end),
      },
    });


    if (weeks.isLeft() || weeks.value.unwrap().items.length == 0)
      return left(Result.Fail(new AppError.ValidationError('Error obteniendo el semestre. Por favor cree el turno en un semestre valido o cree antes el semestre')));

    const week = weeks.value.unwrap().items[0];
    const semester = await this.findSemester.execute(week.semesterId);

    if (semester.isLeft())
      return left(Result.Fail(new AppError.UnexpectedError(new Error('Error obteniendo el semestre. Por favor cree el turno en un semestre valido o cree antes el semestre'))));

    const serieId = v4();
    const endSemester = semester.value.unwrap().end;

    request.start = new Date(request.start);
    request.end = new Date(request.end);

    request.frequency = Object.keys(ClassFrequency)[Object.values(ClassFrequency).indexOf(request.frequency)];

    try {
      const unitOfWork: IUnitOfWork = this._unitOfWorkFact.build();
      await unitOfWork.start();
      const repo = unitOfWork.getRepository(this.repositoryFactory);

      return await unitOfWork.commit(() => this.work(request, repo, serieId, endSemester));

    } catch (e) {
      return left(Result.Fail(new AppError.UnexpectedError(e)));
    }
  }

  private async work(request: ClassCreateInSerieDto, repo: IRepository<Class>, serieId: string, endSemester: Date): Promise<CreateMultipleClassUseCaseResponse> {

    let answer: MultipleResponseDto[] = [];
    let saved = [];

    let lastModificationDay = [null, null, null, null, null, null, null];

    const realRequest = Object.freeze(request);

    let startDate = realRequest.start;
    let endDate = realRequest.end;
    let index = -1;

    while (true) {
      index = ++index > 1 ? 1 : index;

      startDate.setDate(startDate.getDate() + index);
      endDate.setDate(endDate.getDate() + index);

      if (endDate.getTime() > endSemester.getTime())
        break;

      const temp = lastModificationDay[startDate.getDay()];

      if (
        !realRequest.days.includes(startDate.getDay()) ||
        (temp != null && this.getDiffInDays(startDate, temp) % ClassFrequency[realRequest.frequency] != 0))
        continue;

      lastModificationDay[startDate.getDay()] = new Date(startDate);

      const forPass = {
        ...realRequest,
        start: new Date(startDate),
        end: new Date(endDate),
      };

      const ans = await this.createClass.execute({
        ...forPass,
        serieId,
      }, false);

      if (ans.isLeft())
        return left(Result.Fail(new AppError.UnexpectedError(new Error('Fallo en la creacion multiple.\n\n' + ans.value.unwrapError().message))));

      const unwrapped = ans.value.unwrap();

      saved.push(this.generateClassForSave(unwrapped));
      answer.push(this.generateClassForAnswer(unwrapped));

    }

    await repo.saveMany(saved);

    return right(Result.Ok({
      items: answer,
    }));
  }

  private generateClassForSave(unwrapped: any): {} {
    return {
      _id: unwrapped._id,
      shortName: unwrapped.shortName,
      fullName: unwrapped.fullName,
      description: unwrapped.description,
      priority: unwrapped.priority,
      createdAt: unwrapped.createdAt,
      updatedAt: unwrapped.updatedAt,
      teacherIds: unwrapped.teacherIds,
      localId: unwrapped.localId,
      lessonId: unwrapped.lessonId,
      typeClassId: unwrapped.typeClassId,
      weekId: unwrapped.weekId,
      groupId: unwrapped.groupId,
      start: new Date(unwrapped.start.getTime()),
      end: new Date(unwrapped.end.getTime()),
      serieId: unwrapped.serieId,
      color: unwrapped.color,
      resourceId: unwrapped.resourceId,
    };
  }

  private generateClassForAnswer(unwrapped: any): MultipleResponseDto {
    return {
      id: unwrapped._id.toString(),
      start: new Date(unwrapped.start).getTime(),
      end: new Date(unwrapped.end).getTime(),
      color: unwrapped.color,
    };
  }

  private getDiffInDays(date1: Date, date2: Date): number {

    if(!date1 || !date2) return 0;

    const msInDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs(Number(date1) - Number(date2)) / msInDay);
  }
}
