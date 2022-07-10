import { CreateMajorUseCase } from './major.create.use-case';
import { UpdateMajorUseCase } from './major.update.use-case';
import { RemoveMajorUseCase } from './major.remove.use-case';
import { PaginatedMajorUseCase } from './major.paginated.use-case';
import { FindByIdMajorUseCase } from './major.find-by-id.use-case';
import { FindAllMajorUseCase } from './major.find-all.use-case';
import { FindDetailsMajorUseCase } from './major.find-details.use-case';

export * from './major.paginated.use-case';
export * from './major.create.use-case';
export * from './major.find-by-id.use-case';
export * from './major.remove.use-case';
export * from './major.update.use-case';
export * from './major.find-all.use-case';
export * from './major.find-details.use-case';

export const MajorUseCase = [
  FindByIdMajorUseCase,
  CreateMajorUseCase,
  RemoveMajorUseCase,
  UpdateMajorUseCase,
  PaginatedMajorUseCase,
  FindAllMajorUseCase,
  FindDetailsMajorUseCase,
];
