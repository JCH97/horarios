import { SimpleCountRestrictionsPersistence } from './simple-count-restrictions.persistence';
import { CountConditionsRestrictionsPersistence } from './count-conditions.restrictions.persistence';
import { DistributionRestrictionsPersistence } from './distribution-restriction.persistence';
import { ExclusionRestrictionsPersistence } from './exclusion-restriction.persistence';
import { RelationalRestrictionsPersistence } from './relational-restriction.persistence';

export const RestrictionsPersistence = [
  SimpleCountRestrictionsPersistence,
  CountConditionsRestrictionsPersistence,
  DistributionRestrictionsPersistence,
  ExclusionRestrictionsPersistence,
  RelationalRestrictionsPersistence,
];