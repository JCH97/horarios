import { IRepository } from '../../../shared/core/interfaces/IRepository';
import { RelationalRestrictions } from '../entities/RelationalRequirement';

export interface IRelationalRestrictionsRepository extends IRepository<RelationalRestrictions> {
  findDetails(id: string): Promise<RelationalRestrictions>;
};
