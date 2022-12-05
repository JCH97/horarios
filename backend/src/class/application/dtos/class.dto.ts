import { PropsBaseDto } from '../../../shared/core/PropsBaseDto';
import { BaseDto } from '../../../shared/core/BaseDto';

export type ClassDto = PropsBaseDto & BaseDto & {
  start: Date;
  end: Date;
  serieId: string;
  color: string;
  resourceId: string;
  groupId: { id: string; };
}
