import { Module } from '@nestjs/common';
import { DataAccessModule } from '../shared/modules/data-access/data-access.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeekPersistence } from './infra/entities/week.persistence';
import { WeekRepository } from './infra/repositories/week.repository';
import { WeekController } from './presentation/controllers/week.controller';
import { CreateWeekBySemesterUseCase, FindAllWeekUseCase, WeekUseCases } from './application/useCases';

@Module({
  imports: [DataAccessModule, TypeOrmModule.forFeature([WeekPersistence])],
  providers: [...WeekUseCases, WeekRepository],
  exports: [CreateWeekBySemesterUseCase, FindAllWeekUseCase],
  controllers: [WeekController],
})
export class WeekModule {
}