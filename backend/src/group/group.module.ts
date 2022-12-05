import { Module } from '@nestjs/common';
import { DataAccessModule } from '../shared/modules/data-access/data-access.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupPersistence } from './infra/entities/group.persistence';
import { FindAllGroupUseCase, FindByIdGroupUseCase, GroupUseCases } from './application/useCases';
import { GroupRepository } from './infra/repositories/group.repository';
import { FacultyModule } from '../faculty/faculty.module';
import { GroupController } from './presentation/controller/group.controller';

@Module({
  imports: [
    DataAccessModule,
    TypeOrmModule.forFeature([GroupPersistence]),
    FacultyModule,
  ],
  providers: [...GroupUseCases, GroupRepository],
  exports: [FindByIdGroupUseCase, FindAllGroupUseCase],
  controllers: [GroupController],
})
export class GroupModule {
}
