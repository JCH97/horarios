import { PropsBaseDto } from '../../../shared/core/PropsBaseDto';
import { BaseDto } from '../../../shared/core/BaseDto';

export type LessonDto = PropsBaseDto & BaseDto & {
  duration: number;
  year: number;
  majorId: { id: string },
  localId: { id: string },
  teacherId: { id: string }
}