import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { Class } from '../../domain/entities/class.entity';
import { Result } from '../../../shared/core/Result';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { Injectable, Logger } from '@nestjs/common';
import { ClassRepository } from '../../infra/repositories/class.repository';
import { ClassQueryDto } from '../dtos/class.query.dto';
import { ClassMappers } from '../../infra/mappers/class.mapper';

export type QueryClassUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<Class>>
    | AppError.ValidationErrorResult<FindAllResult<Class>>
    | AppError.ObjectNotExistResult<FindAllResult<Class>>,
    Result<FindAllResult<Class>>>;

@Injectable()
export class QueryClassUseCase implements IUseCase<ClassQueryDto, Promise<QueryClassUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly classRepository: ClassRepository) {
    this._logger = new Logger('QueryClassUseCase');
  }

  async execute(request: ClassQueryDto): Promise<QueryClassUseCaseResponse> {
    this._logger.log('Executing...');

    try {

      let qb = (await this
        .classRepository
        .getQueryBuilder('class'))
        .leftJoinAndSelect('class.group', 'group');

      if (request.lessons && request.lessons.length > 0)
        qb.andWhere('lesson_id IN (:...lessonIds)', { lessonIds: request.lessons });

      if (request.locals && request.locals.length > 0)
        qb.andWhere('local_id IN (:...localIds)', { localIds: request.locals });

      if (request.types && request.types.length > 0)
        qb.andWhere('type_class_id IN (:...typeIds)', { typeIds: request.types });

      if (request.groups && request.groups.length > 0)
        qb.andWhere('group_id IN (:...groupIds)', { groupIds: request.groups });

      if (request.majors && request.majors.length > 0)
        qb.andWhere('group.major_id IN (:...majorIds)', { majorIds: request.majors });

      if (request.start)
        qb.andWhere('start >= :start', { start: request.start });

      if (request.end)
        qb.andWhere('"end" <= :end', { end: request.end });

      const ans = await qb.getMany();

      return right(Result.Ok({
        items: ans.map(ClassMappers.PersistToDomain),
      }));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
