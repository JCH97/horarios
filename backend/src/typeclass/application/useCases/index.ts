import { CreateTypeClassUseCase } from './typeclass.create.use-case';
import { UpdateTypeClassUseCase } from './typeclass.update.use-case';
import { RemoveTypeClassUseCase } from './typeclass.remove.use-case';
import { TypeClassPaginatedUseCase } from './typeclass.paginated.use-case';
import { FindByIdTypeClassUseCase } from './typeclass.find-by-id.use-case';
import { FindAllTypeClassUseCase } from './typeclass.get-all.use-case';

export * from './typeclass.paginated.use-case';
export * from './typeclass.create.use-case';
export * from './typeclass.find-by-id.use-case';
export * from './typeclass.remove.use-case';
export * from './typeclass.update.use-case';
export * from './typeclass.get-all.use-case';

export const TypeClassUseCase = [
  FindByIdTypeClassUseCase,
  CreateTypeClassUseCase,
  RemoveTypeClassUseCase,
  UpdateTypeClassUseCase,
  TypeClassPaginatedUseCase,
  FindAllTypeClassUseCase,
];
