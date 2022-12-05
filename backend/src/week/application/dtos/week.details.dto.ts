import { WeekDto } from './week.dto';
import { SemesterDetailsDto } from '../../../semester/application/dtos/semester.details.dto';

export type WeekDetailsDto = WeekDto & {
  semester?: SemesterDetailsDto;
};