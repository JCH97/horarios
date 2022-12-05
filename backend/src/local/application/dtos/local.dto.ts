import { PropsBaseDto } from '../../../shared/core/PropsBaseDto';
import { BaseDto } from '../../../shared/core/BaseDto';

export type LocalDto = PropsBaseDto & BaseDto & {
  capacity: number;
}
