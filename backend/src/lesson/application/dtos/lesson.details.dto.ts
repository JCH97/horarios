import { LessonDto } from './lesson.dto';
import { LocalDto } from '../../../local/application/dtos/local.dto';
import { MajorDto } from '../../../major/application/dtos/major.dto';
import { TeacherDto } from '../../../teacher/application/dtos/teacher.dto';
import { TeacherDetailsDto } from '../../../teacher/application/dtos/teacher.details.dto';
import { LocalDetailsDto } from '../../../local/application/dtos/local.details.dto';
import { MajorDetailsDto } from '../../../major/application/dtos/major.details.dto';
import { SemesterDto } from '../../../semester/application/dtos/semester.dto';

export type LessonDetailsDto = LessonDto & {
  local?: LocalDetailsDto;
  major?: MajorDetailsDto;
  teacher?: TeacherDetailsDto;
  semesters?: SemesterDto[]
}