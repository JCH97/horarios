import { MajorDto } from './major.dto';
import { FacultyDto } from '../../../faculty/application/dtos/faculty.dto';

export type MajorDetailsDto = MajorDto & {
  faculty?: FacultyDto
};