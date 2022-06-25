import { BaseDto } from '../../../shared/core/BaseDto';

export type WeekDto = BaseDto & {
  shortName: string;
  fullName: string;
  description: string;
  priority: number;
  duration: number;
  firstDay?: string;
  endDay?: string;
  number?: number;
}