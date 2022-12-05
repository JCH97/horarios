import { BaseRestrictionsDto } from '../base-restrictions.dto';

export type ExclusionRestrictionsDto = BaseRestrictionsDto & {
  attributes: string[];
}
