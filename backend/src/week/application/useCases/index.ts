import { CreateWeekUseCase } from './week.create.use-case';
import { RemoveWeekUseCase } from './week.remove.use-case';
import { FindByIdWeekUseCase } from './week.find-by-id.use-case';
import { UpdateWeekUseCase } from './week.update.use-case';
import { PaginatedWeekUseCase } from './week.paginated.use-case';
import { FindAllWeekUseCase } from './week.get-all.use-case';
import { CreateWeekBySemesterUseCase } from './week.create-by-semester.use-case';
import { FindDetailsWeekUseCase } from './week.get-datails.use-case';

export * from './week.find-by-id.use-case';
export * from './week.remove.use-case';
export * from './week.update.use-case';
export * from './week.create.use-case';
export * from './week.paginated.use-case';
export * from './week.get-all.use-case';
export * from './week.create-by-semester.use-case';
export * from './week.get-datails.use-case';

export const WeekUseCases = [
  CreateWeekUseCase,
  RemoveWeekUseCase,
  FindByIdWeekUseCase,
  UpdateWeekUseCase,
  PaginatedWeekUseCase,
  FindAllWeekUseCase,
  CreateWeekBySemesterUseCase,
  FindDetailsWeekUseCase,
];