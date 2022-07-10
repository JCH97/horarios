import { TeacherDto } from './teacher.dto';

export type TeacherCreateDto = Omit<TeacherDto, 'id' | 'createdAt' | 'updatedAt'> & {
  facultyIds: { id: string }[];
  departmentId: { id: string };
};