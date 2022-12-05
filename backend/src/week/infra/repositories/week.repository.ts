import { BaseRepository } from '../../../shared/modules/data-access/typeorm/base.respository';
import { Week } from '../../domain/entities/week.entity';
import { WeekPersistence } from '../entities/week.persistence';
import { IWeekRepository } from '../../domain/interfaces/IWeekRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeekMapper } from '../mappers/week.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WeekRepository extends BaseRepository<Week, WeekPersistence> implements IWeekRepository {
  constructor(@InjectRepository(WeekPersistence) _repository: Repository<WeekPersistence>) {
    super(_repository, WeekMapper.DomainToPersist, WeekMapper.PersistToDomain, 'WeekRepository');
  }


  async findDetails(id: string): Promise<Week> {
    const week = await this
      ._entityRepository
      .findOne(id, {
        relations: ['semester'],
      });

    return WeekMapper.PersistToDomain(week);
  }
}