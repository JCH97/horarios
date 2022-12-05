import { SimpleRestrictionsController } from './simple.restrictions.controller';
import { CountConditionsRestrictionsController } from './count-conditions.restrictions.controller';
import { RestrictionsController } from './restrictions.controller';
import { DistributionRestrictionsController } from './distribution-restrictions.controller';
import { RelationalRestrictionsController } from './relational-restrictions.controllers';

export const Controllers = [
  SimpleRestrictionsController,
  CountConditionsRestrictionsController,
  RestrictionsController,
  DistributionRestrictionsController,
  RelationalRestrictionsController
];