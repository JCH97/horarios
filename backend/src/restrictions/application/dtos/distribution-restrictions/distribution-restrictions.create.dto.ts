import { DistributionRestrictionsDto } from './distribution-restrictions.dto';

export type DistributionRestrictionsCreateDto = DistributionRestrictionsDto & {
  conditions: string;
}
