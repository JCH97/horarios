import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../shared/modules/data-access/typeorm/base.respository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExclusionRestrictions } from '../../domain/entities/exclusion-restriction.entity';
import { ExclusionRestrictionsPersistence } from '../entities/exclusion-restriction.persistence';
import { IExclusionRestrictionsRepository } from '../../domain/interfaces/IExclusionRestrictionRepository';
import { ExclusionRestrictionsMappers } from '../mappers/exclusion-restrictions.mappers';

@Injectable()
export class ExclusionRestrictionsRepository extends BaseRepository<ExclusionRestrictions, ExclusionRestrictionsPersistence> implements IExclusionRestrictionsRepository {
  constructor(@InjectRepository(ExclusionRestrictionsPersistence) _repository: Repository<ExclusionRestrictionsPersistence>) {
    super(_repository, ExclusionRestrictionsMappers.DomainToPersist, ExclusionRestrictionsMappers.PersistToDomain, 'ExclusionRestrictionsRepository');
  }

  async findDetails(id: string): Promise<ExclusionRestrictions> {
    const countRestrictions = await this
      ._entityRepository
      .findOne(id, {
        // relations: [
        //   'faculty',
        //   'faculty.university',
        //   'major',
        // ],
      });

    return ExclusionRestrictionsMappers.PersistToDomain(countRestrictions);
  }
}
