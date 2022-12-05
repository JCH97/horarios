import { Module } from '@nestjs/common';
import { DataAccessModule } from '../shared/modules/data-access/data-access.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindAllLocalUseCase, LocalUseCase } from './application/useCases';
import { LocalRepository } from './infra/repositories/local.repository';
import { LocalController } from './presentation/controllers/local.controller';
import { LocalPersistence } from './infra/entities/local.persistence';

@Module({
  imports: [DataAccessModule, TypeOrmModule.forFeature([LocalPersistence])],
  providers: [...LocalUseCase, LocalRepository],
  exports: [FindAllLocalUseCase],
  controllers: [LocalController],
})
export class LocalModule {
}
