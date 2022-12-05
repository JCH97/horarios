import { ClassDto } from './class.dto';

export type ClassCreateDto = Omit<ClassDto, 'id' | 'createdAt' | 'updatedAt'> & {
  teacherIds: { id: string }[];
  localId: { id: string };
  lessonId: { id: string };
  typeClassId: { id: string };
  groupId: { id: string };
};
