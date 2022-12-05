import { BaseRestrictionsDto } from '../base-restrictions.dto';

export type DistributionRestrictionsDto = BaseRestrictionsDto & {
  min: number;
  operator: string;
  attribute: string;
}
