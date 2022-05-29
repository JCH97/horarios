import { CreateUniversityUseCase } from './university.create.use-case';
import { RemoveUniversityUseCase } from './university.remove.use-case';
import { FindByIdUniversityUseCase } from './university.find-by-id.use-case';
import { UpdateUniversityUseCase } from './university.update.use-case';
import { PaginatedUniversityUseCase } from './university.paginated.use-case';
import { FindAllUniversityUseCase } from './university.get-all.use-case';

export * from './university.find-by-id.use-case';
export * from './university.remove.use-case';
export * from './university.update.use-case';
export * from './university.create.use-case';
export * from './university.paginated.use-case';
export * from './university.get-all.use-case';

export const UniversityUseCases = [
  CreateUniversityUseCase,
  RemoveUniversityUseCase,
  FindByIdUniversityUseCase,
  UpdateUniversityUseCase,
  PaginatedUniversityUseCase,
  FindAllUniversityUseCase,
];