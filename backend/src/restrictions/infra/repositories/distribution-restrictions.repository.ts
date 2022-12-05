import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../shared/modules/data-access/typeorm/base.respository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistributionRestrictions } from '../../domain/entities/distribution-restriction.entity';
import { DistributionRestrictionsPersistence } from '../entities/distribution-restriction.persistence';
import { DistributionRestrictionsMappers } from '../mappers/distribution-restrictions.mappers';
import { IDistributionRestrictionsRepository } from '../../domain/interfaces/IDistributionRestrictionRepository';

@Injectable()
export class DistributionRestrictionsRepository extends BaseRepository<DistributionRestrictions, DistributionRestrictionsPersistence> implements IDistributionRestrictionsRepository {
  constructor(@InjectRepository(DistributionRestrictionsPersistence) _repository: Repository<DistributionRestrictionsPersistence>) {
    super(_repository, DistributionRestrictionsMappers.DomainToPersist, DistributionRestrictionsMappers.PersistToDomain, 'DistributionRestrictionsRepository');
  }

  async findDetails(id: string): Promise<DistributionRestrictions> {
    const countRestrictions = await this
      ._entityRepository
      .findOne(id, {
        // relations: [
        //   'faculty',
        //   'faculty.university',
        //   'major',
        // ],
      });

    return DistributionRestrictionsMappers.PersistToDomain(countRestrictions);
  }
}
