import { BaseDto } from '../../../shared/core/BaseDto';
import { PropsBaseDto } from '../../../shared/core/PropsBaseDto';

export type LocalCreateDto = PropsBaseDto & BaseDto & {
  facultyId: string;
  capacity: number;
}
