import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../shared/modules/data-access/typeorm/base.respository';
import { Lesson } from '../../../lesson/domain/entities/lesson.entity';
import { LessonPersistence } from '../../../lesson/infra/entities/lesson.persistence';
import { ILessonRepository } from '../../../lesson/domain/interfaces/ILessonRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonMappers } from '../mappers/lesson.mapper';

@Injectable()
export class LessonRepository extends BaseRepository<Lesson, LessonPersistence> implements ILessonRepository {
  constructor(@InjectRepository(LessonPersistence) _repository: Repository<LessonPersistence>) {
    super(_repository, LessonMappers.DomainToPersist, LessonMappers.PersistToDomain, 'LessonRepository');
  }

  async findDetails(id: string): Promise<Lesson> {
    const lesson = await this
      ._entityRepository
      .findOne(id, {
        relations: ['major', 'local', 'teacher', 'semesters'],
      });

    return LessonMappers.PersistToDomain(lesson);
  }
}
