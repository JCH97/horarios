import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../shared/modules/data-access/typeorm/base.respository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RelationalRestrictionsPersistence } from '../entities/relational-restriction.persistence';
import { RelationalRestrictions } from '../../domain/entities/RelationalRequirement';
import { RelationalRestrictionsMappers } from '../mappers/relational-restrictions.mappers';
import { IRelationalRestrictionsRepository } from '../../domain/interfaces/IRelationalRestrictionsRepository';

@Injectable()
export class RelationalRestrictionsRepository extends BaseRepository<RelationalRestrictions, RelationalRestrictionsPersistence> implements IRelationalRestrictionsRepository {
  constructor(@InjectRepository(RelationalRestrictionsPersistence) _repository: Repository<RelationalRestrictionsPersistence>) {
    super(_repository, RelationalRestrictionsMappers.DomainToPersist, RelationalRestrictionsMappers.PersistToDomain, 'RelationalRestrictionsRepository');
  }

  async findDetails(id: string): Promise<RelationalRestrictions> {
    const countRestrictions = await this
      ._entityRepository
      .findOne(id, {
        // relations: [
        //   'faculty',
        //   'faculty.university',
        //   'major',
        // ],
      });

    return RelationalRestrictionsMappers.PersistToDomain(countRestrictions);
  }
}
