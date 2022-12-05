import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../shared/modules/data-access/typeorm/base.respository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../../domain/entities/class.entity';
import { ClassPersistence } from '../entities/class.persistence';
import { IClassRepository } from '../../domain/interfaces/IClassRepository';
import { ClassMappers } from '../mappers/class.mapper';

@Injectable()
export class ClassRepository extends BaseRepository<Class, ClassPersistence> implements IClassRepository {
  constructor(@InjectRepository(ClassPersistence) _repository: Repository<ClassPersistence>) {
    super(_repository, ClassMappers.DomainToPersist, ClassMappers.PersistToDomain, 'ClassRepository');
  }

  async findDetails(id: string): Promise<Class> {
    const c = await this
      ._entityRepository
      .findOne(id, {
        relations: ['lesson', 'teachers', 'local', 'typeClass', 'group'],
      });

    return ClassMappers.PersistToDomain(c);
  }

  async findAllWithDetails(filter = {}, sort = {}): Promise<Class[]> {
    const c = await this
      ._entityRepository
      .find({
        where: filter,
        order: sort,
        relations: ['lesson', 'local', 'typeClass', 'week', 'group'],
      });

    return c.map(ClassMappers.PersistToDomain);
  }
}
