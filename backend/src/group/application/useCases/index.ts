import { CreateGroupUseCase } from './group.create.use-case';
import { FindByIdGroupUseCase } from './group.find-by-id.use-case';
import { FindDetailsGroupUseCase } from './group.get-one-details.use-case';
import { RemoveGroupUseCase } from './group.remove.use-case';
import { UpdateGroupUseCase } from './group.update.use-case';
import { PaginatedGroupUseCase } from './group.paginated.use-case';
import { FindAllGroupUseCase } from './group.find-all.use-case';

export * from './group.create.use-case';
export * from './group.find-by-id.use-case';
export * from './group.get-one-details.use-case';
export * from './group.remove.use-case';
export * from './group.update.use-case';
export * from './group.paginated.use-case';
export * from './group.find-all.use-case';

export const GroupUseCases = [
  CreateGroupUseCase,
  FindByIdGroupUseCase,
  FindDetailsGroupUseCase,
  RemoveGroupUseCase,
  UpdateGroupUseCase,
  PaginatedGroupUseCase,
  FindAllGroupUseCase,
];