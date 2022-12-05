import { IRepository } from '../../../shared/core/interfaces/IRepository';
import { CountConditionsRestrictions } from '../entities/count-conditions.restrictions.entity';

export interface ICountConditionsRestrictionsRepository extends IRepository<CountConditionsRestrictions> {
  findDetails(id: string): Promise<CountConditionsRestrictions>;
};
