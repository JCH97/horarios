import { IRepository } from '../../../shared/core/interfaces/IRepository';
import { DistributionRestrictions } from '../entities/distribution-restriction.entity';

export interface IDistributionRestrictionsRepository extends IRepository<DistributionRestrictions> {
  findDetails(id: string): Promise<DistributionRestrictions>;
};
