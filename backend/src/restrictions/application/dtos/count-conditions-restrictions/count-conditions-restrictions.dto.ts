import { BaseRestrictionsDto } from '../base-restrictions.dto';

export type CountConditionsRestrictionsDto = BaseRestrictionsDto & {
  part: number;
  subConditions: {};
  operator: string;
}
