import { LessonDto } from './lesson.dto';

export type LessonCreateDto = Omit<LessonDto, 'id' | 'createdAt' | 'updatedAt'>;
