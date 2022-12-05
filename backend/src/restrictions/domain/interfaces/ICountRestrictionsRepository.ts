import { IRepository } from '../../../shared/core/interfaces/IRepository';
import { SimpleCountRestrictions } from '../entities/simple-count-restriction.entity';

export interface ICountRestrictionsRepository extends IRepository<SimpleCountRestrictions> {
  findDetails(id: string): Promise<SimpleCountRestrictions>;
};
