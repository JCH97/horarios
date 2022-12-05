import { ClassDto } from './class.dto';

export type ClassUpdateDto = Omit<Partial<ClassDto>, 'id'> & {
  classId: string;
  teacherIds?: { id: string }[];
  localId?: { id: string };
  lessonId?: { id: string };
  typeClassId?: { id: string };
  groupId?: { id: string };
};