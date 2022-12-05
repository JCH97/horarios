import { IRepository } from '../../../shared/core/interfaces/IRepository';
import { ExclusionRestrictions } from '../entities/exclusion-restriction.entity';

export interface IExclusionRestrictionsRepository extends IRepository<ExclusionRestrictions> {
  findDetails(id: string): Promise<ExclusionRestrictions>;
};
