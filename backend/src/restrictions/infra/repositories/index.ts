import { CountConditionsRestrictionsRepository } from './count-conditions.restrictions.repository';
import { SimpleCountRestrictionsRepository } from './simple-count-restrictions-repository.service';
import { DistributionRestrictionsRepository } from './distribution-restrictions.repository';
import { RelationalRestrictionsRepository } from './relational-restriction.repository';

export const RestrictionsRepositories = [
  SimpleCountRestrictionsRepository,
  CountConditionsRestrictionsRepository,
  DistributionRestrictionsRepository,
  RelationalRestrictionsRepository
];