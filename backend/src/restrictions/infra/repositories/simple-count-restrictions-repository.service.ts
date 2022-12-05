import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../shared/modules/data-access/typeorm/base.respository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SimpleCountRestrictionsPersistence } from '../entities/simple-count-restrictions.persistence';
import { SimpleCountRestrictions } from '../../domain/entities/simple-count-restriction.entity';
import { SimpleCountRestrictionsMappers } from '../mappers/simple-count-restrictions.mappers';
import { ICountRestrictionsRepository } from '../../domain/interfaces/ICountRestrictionsRepository';

@Injectable()
export class SimpleCountRestrictionsRepository extends BaseRepository<SimpleCountRestrictions, SimpleCountRestrictionsPersistence> implements ICountRestrictionsRepository {
  constructor(@InjectRepository(SimpleCountRestrictionsPersistence) _repository: Repository<SimpleCountRestrictionsPersistence>) {
    super(_repository, SimpleCountRestrictionsMappers.DomainToPersist, SimpleCountRestrictionsMappers.PersistToDomain, 'SimpleCountRestrictionsRepository');
  }

  async findDetails(id: string): Promise<SimpleCountRestrictions> {
    const countRestrictions = await this
      ._entityRepository
      .findOne(id, {
        // relations: [
        //   'faculty',
        //   'faculty.university',
        //   'major',
        // ],
      });

    return SimpleCountRestrictionsMappers.PersistToDomain(countRestrictions);
  }
}
