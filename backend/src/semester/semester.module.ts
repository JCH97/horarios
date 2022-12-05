import { Module } from '@nestjs/common';
import { DataAccessModule } from '../shared/modules/data-access/data-access.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemesterPersistence } from './infra/entities/semester.persistence';
import { SemesterRepository } from './infra/repositories/semester.repository';
import { SemesterController } from './presentation/controllers/semester.controller';
import { FindByIdSemesterUseCase, SemesterUseCases } from './application/useCases';
import { WeekModule } from '../week/week.module';

@Module({
  imports: [
    DataAccessModule,
    TypeOrmModule.forFeature([SemesterPersistence]),
    WeekModule],
  providers: [...SemesterUseCases, SemesterRepository],
  exports: [FindByIdSemesterUseCase],
  controllers: [SemesterController],
})
export class SemesterModule {
}