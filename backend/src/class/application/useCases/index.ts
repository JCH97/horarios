import { CreateClassUseCase } from './class.create.use-case';
import { FindByIdClassUseCase } from './class.find-by-id.use-case';
import { FindDetailsClassUseCase } from './class.get-one-details.use-case';
import { PaginatedClassUseCase } from './class.paginated.use-case';
import { RemoveClassUseCase } from './class.remove.use-case';
import { UpdateClassUseCase } from './class.update.use-case';
import { FindAllClassUseCase } from './class.find-all.use-case';
import { UpdateMultipleClassInSameSerieByDropUseCase } from './class.update-multiple-same-serie.use-case';
import { CheckClassUseCase } from './class.check-class-restrictions.use-case';
import { RemoveInSerieClassUseCase } from './class.remove-in-serie.use-case';
import { QueryClassUseCase } from './class.query.use-case';
import { CreteMultipleClassInSameSerieUseCase } from './class.create-in-serie.use-case';
import { FindAllWithDetailsClassUseCase } from './class.find-all-details.use-case';
import { UpdateMultipleClassByFieldsUseCase } from './class.update-multiple-fields.use-case';

export * from './class.create.use-case';
export * from './class.find-by-id.use-case';
export * from './class.get-one-details.use-case';
export * from './class.paginated.use-case';
export * from './class.remove.use-case';
export * from './class.update.use-case';
export * from './class.find-all.use-case';
export * from './class.update-multiple-same-serie.use-case';
export * from './class.check-class-restrictions.use-case';
export * from './class.remove-in-serie.use-case';
export * from './class.query.use-case';
export * from './class.create-in-serie.use-case';
export * from './class.find-all-details.use-case';
export * from './class.update-multiple-fields.use-case';

export const ClassUseCases = [
  CreateClassUseCase,
  FindByIdClassUseCase,
  FindDetailsClassUseCase,
  PaginatedClassUseCase,
  RemoveClassUseCase,
  UpdateClassUseCase,
  FindAllClassUseCase,
  UpdateMultipleClassInSameSerieByDropUseCase,
  CheckClassUseCase,
  RemoveInSerieClassUseCase,
  QueryClassUseCase,
  CreteMultipleClassInSameSerieUseCase,
  FindAllWithDetailsClassUseCase,
  UpdateMultipleClassByFieldsUseCase,
];