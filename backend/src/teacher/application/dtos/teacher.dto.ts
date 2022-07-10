import { PropsBaseDto } from '../../../shared/core/PropsBaseDto';
import { BaseDto } from '../../../shared/core/BaseDto';

export type TeacherDto = PropsBaseDto & BaseDto & {
  email: string;
  departmentId: { id: string };
}
