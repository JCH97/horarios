import { TeacherDto } from './teacher.dto';
import { FacultyDto } from '../../../faculty/application/dtos/faculty.dto';
import { UniversityDto } from '../../../university/application/dtos/university.dto';
import { Department } from '../../../department/domain/entities/department.entity';
import { DepartmentDetailsDto } from '../../../department/application/dtos/department.details.dto';
import { FacultyDetailsDto } from '../../../faculty/application/dtos/facultyDetailsDto';

export type TeacherDetailsDto = TeacherDto & {
  faculties: FacultyDetailsDto[],
  department?: DepartmentDetailsDto,
  university?: UniversityDto
}