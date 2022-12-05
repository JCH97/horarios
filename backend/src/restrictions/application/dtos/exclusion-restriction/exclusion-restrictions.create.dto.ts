import { ExclusionRestrictionsDto } from './exclusion-restrictions.dto';

export type ExclusionRestrictionsCreateDto = ExclusionRestrictionsDto & {
  conditions: string;
}
