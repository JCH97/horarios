import { CreateSemesterUseCase } from './semester.create.use-case';
import { RemoveSemesterUseCase } from './semester.remove.use-case';
import { FindByIdSemesterUseCase } from './semester.find-by-id.use-case';
import { UpdateSemesterUseCase } from './semester.update.use-case';
import { PaginatedSemesterUseCase } from './semester.paginated.use-case';
import { FindAllSemesterUseCase } from './semester.get-all.use-case';
import { FindDetailsSemesterUseCase } from './semester.details.use-case';

export * from './semester.find-by-id.use-case';
export * from './semester.remove.use-case';
export * from './semester.update.use-case';
export * from './semester.create.use-case';
export * from './semester.paginated.use-case';
export * from './semester.get-all.use-case';
export * from './semester.details.use-case';

export const SemesterUseCases = [
  CreateSemesterUseCase,
  RemoveSemesterUseCase,
  FindByIdSemesterUseCase,
  UpdateSemesterUseCase,
  PaginatedSemesterUseCase,
  FindAllSemesterUseCase,
  FindDetailsSemesterUseCase,
];