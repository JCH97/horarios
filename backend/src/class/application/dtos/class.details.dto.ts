import { ClassDto } from './class.dto';
import { TeacherDetailsDto } from '../../../teacher/application/dtos/teacher.details.dto';
import { LessonDetailsDto } from '../../../lesson/application/dtos/lesson.details.dto';
import { LocalDetailsDto } from '../../../local/application/dtos/local.details.dto';
import { TypeClassDetailsDto } from '../../../typeclass/application/dtos/typeclass.details.dto';
import { GroupDetailsDto } from '../../../group/application/dtos/group.details.dto';
import { WeekDetailsDto } from '../../../week/application/dtos/week.details.dto';

export type ClassDetailsDto = ClassDto & {
  teachers?: TeacherDetailsDto[],
  lesson?: LessonDetailsDto,
  local?: LocalDetailsDto,
  typeClass?: TypeClassDetailsDto,
  group?: GroupDetailsDto;
  week?: WeekDetailsDto;
  amountInSerie: number;
}
