import { BaseRepository } from '../../../shared/modules/data-access/typeorm/base.respository';
import { Semester } from '../../domain/entities/semester.entity';
import { SemesterPersistence } from '../entities/semester.persistence';
import { ISemesterRepository } from '../../domain/interfaces/ISemesterRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemesterMapper } from '../mappers/semester.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SemesterRepository extends BaseRepository<Semester, SemesterPersistence> implements ISemesterRepository {
  constructor(@InjectRepository(SemesterPersistence) _repository: Repository<SemesterPersistence>) {
    super(_repository, SemesterMapper.DomainToPersist, SemesterMapper.PersistToDomain, 'SemesterRepository');
  }

  async findDetails(id: string): Promise<Semester> {
    const semester = await this
      ._entityRepository
      .findOne(id, {
        relations: [],
      });

    return SemesterMapper.PersistToDomain(semester);
  }
}