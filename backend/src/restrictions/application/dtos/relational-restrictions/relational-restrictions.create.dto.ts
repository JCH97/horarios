import { RelationalRestrictionsDto } from './relational-restrictions.dto';

export type RelationalRestrictionsCreateDto = RelationalRestrictionsDto & {
  conditions: string;
  subConditions: string;
  attribute: string;
};
