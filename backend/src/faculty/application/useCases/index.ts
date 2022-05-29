import { CreateFacultyUseCase } from './faculty.create.use-case';
import { UpdateFacultyUseCase } from './faculty.update.use-case';
import { RemoveFacultyUseCase } from './faculty.remove.use-case';
import { PaginatedFacultyUseCase } from './faculty.paginated.use-case';
import { FindByIdFacultyUseCase } from './faculty.find-by-id.use-case';
import { FindAllFacultyUseCase } from './faculty.find-all.use-case';

export * from './faculty.paginated.use-case';
export * from './faculty.create.use-case';
export * from './faculty.find-by-id.use-case';
export * from './faculty.remove.use-case';
export * from './faculty.update.use-case';
export * from './faculty.find-all.use-case';

export const FacultyUseCases = [
  FindByIdFacultyUseCase,
  CreateFacultyUseCase,
  RemoveFacultyUseCase,
  UpdateFacultyUseCase,
  PaginatedFacultyUseCase,
  FindAllFacultyUseCase,
];