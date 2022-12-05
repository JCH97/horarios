import { CountConditionsRestrictionsDto } from './count-conditions-restrictions.dto';

export type CountConditionsRestrictionsCreateDto = CountConditionsRestrictionsDto & {
  conditions: string;
  subConditions: string;
};
