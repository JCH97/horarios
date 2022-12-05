import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../shared/modules/data-access/typeorm/base.respository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountConditionsRestrictions } from '../../domain/entities/count-conditions.restrictions.entity';
import { CountConditionsRestrictionsPersistence } from '../entities/count-conditions.restrictions.persistence';
import { ICountConditionsRestrictionsRepository } from '../../domain/interfaces/ICountConditionsRepository';
import { CountConditionsRestrictionsMappers } from '../mappers/count-conditions.restrictions.mappers';

@Injectable()
export class CountConditionsRestrictionsRepository extends BaseRepository<CountConditionsRestrictions, CountConditionsRestrictionsPersistence> implements ICountConditionsRestrictionsRepository {
  constructor(@InjectRepository(CountConditionsRestrictionsPersistence) _repository: Repository<CountConditionsRestrictionsPersistence>) {
    super(_repository, CountConditionsRestrictionsMappers.DomainToPersist, CountConditionsRestrictionsMappers.PersistToDomain, 'CountConditionsRestrictionsRepository');
  }

  async findDetails(id: string): Promise<CountConditionsRestrictions> {
    const countRestrictions = await this
      ._entityRepository
      .findOne(id, {
        // relations: [
        //   'faculty',
        //   'faculty.university',
        //   'major',
        // ],
      });

    return CountConditionsRestrictionsMappers.PersistToDomain(countRestrictions);
  }
}
