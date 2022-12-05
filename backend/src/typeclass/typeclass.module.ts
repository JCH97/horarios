import { Module } from '@nestjs/common';
import { DataAccessModule } from '../shared/modules/data-access/data-access.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeclassPersistence } from './infra/entities/typeclass.persistence';
import { FindAllTypeClassUseCase, TypeClassUseCase } from './application/useCases';
import { TypeclassRepository } from './infra/repositories/typeclass.repository';
import { TypeClassController } from './presentation/controllers/typeclass.controller';

@Module({
  imports: [DataAccessModule, TypeOrmModule.forFeature([TypeclassPersistence])],
  providers: [...TypeClassUseCase, TypeclassRepository],
  exports: [FindAllTypeClassUseCase],
  controllers: [TypeClassController],
})
export class TypeclassModule {
}
