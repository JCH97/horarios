import { SimpleCountRestrictionsDto } from './simple-count-restrictions.dto';

export type CountRestrictionsCreateDto = SimpleCountRestrictionsDto & {
  conditions: string;
};