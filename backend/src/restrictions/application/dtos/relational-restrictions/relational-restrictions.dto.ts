import { BaseRestrictionsDto } from '../base-restrictions.dto';

export type RelationalRestrictionsDto = BaseRestrictionsDto & {
  attribute: string;
  subConditions: {};
  operator: string;
}
