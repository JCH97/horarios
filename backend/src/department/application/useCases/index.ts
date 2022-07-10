import { CreateDepartmentUseCase } from './department.create.use-case';
import { FindByIdDepartmentUseCase } from './department.find-by-id.use-case';
import { FindDetailsDepartmentUseCase } from './department.ge-one-details.use-case';
import { PaginatedDepartmentUseCase } from './department.paginated.use-case';
import { RemoveDepartmentUseCase } from './department.remove.use-case';
import { UpdateDepartmentUseCase } from './department.update.use-case';
import { FindAllDepartmentUseCase } from './department.get-all.use-case';

export * from './department.create.use-case';
export * from './department.find-by-id.use-case';
export * from './department.ge-one-details.use-case';
export * from './department.paginated.use-case';
export * from './department.remove.use-case';
export * from './department.update.use-case';
export * from './department.get-all.use-case';

export const DepartmentUseCases = [
  CreateDepartmentUseCase,
  FindByIdDepartmentUseCase,
  FindDetailsDepartmentUseCase,
  PaginatedDepartmentUseCase,
  RemoveDepartmentUseCase,
  UpdateDepartmentUseCase,
  FindAllDepartmentUseCase,
];