import { CreateTeacherUseCase } from './teacher.create.use-case';
import { PaginatedTeacherUseCase } from './teacher.paginated.use-case';
import { RemoveTeacherUseCase } from './teacher.remove.use-case';
import { UpdateTeacherUseCase } from './teacher.update.use-case';
import { FindByIdTeacherUseCase } from './teacher.find-by-id.use-case';
import { FindDetailsTeacherUseCase } from './teacher.get-one-details.use-case';
import { FindAllTeacherUseCase } from './teacher.get-all.use-case';
import { TeacherBreakUserLinkUseCase } from './teacher.break-link-user.use-case';

export * from './teacher.create.use-case';
export * from './teacher.paginated.use-case';
export * from './teacher.remove.use-case';
export * from './teacher.update.use-case';
export * from './teacher.find-by-id.use-case';
export * from './teacher.get-one-details.use-case';
export * from './teacher.get-all.use-case';
export * from './teacher.break-link-user.use-case';

export const TeacherUseCases = [
  CreateTeacherUseCase,
  PaginatedTeacherUseCase,
  RemoveTeacherUseCase,
  UpdateTeacherUseCase,
  FindByIdTeacherUseCase,
  FindDetailsTeacherUseCase,
  FindAllTeacherUseCase,
  TeacherBreakUserLinkUseCase,
];