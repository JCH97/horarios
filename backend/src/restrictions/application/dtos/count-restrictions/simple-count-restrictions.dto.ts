import { BaseRestrictionsDto } from '../base-restrictions.dto';

export type SimpleCountRestrictionsDto = BaseRestrictionsDto & {
  min?: number;
  part?: number;
  operator: string;
}