import { Module } from '@nestjs/common';
import { DataAccessModule } from '../shared/modules/data-access/data-access.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassPersistence } from './infra/entities/class.persistence';
import { ClassUseCases, FindAllClassUseCase, FindAllWithDetailsClassUseCase } from './application/useCases';
import { ClassRepository } from './infra/repositories/class.repository';
import { ClassController } from './presentation/controllers/class.controller';
import { FacultyModule } from '../faculty/faculty.module';
import { GroupModule } from '../group/group.module';
import { WeekModule } from '../week/week.module';
import { SemesterModule } from '../semester/semester.module';
import { TypeOrmUnitOfWorkFactory } from '../shared/modules/data-access/typeorm/unitwork.factory';
import { ClassRepositoryFact } from './infra/repositories/class.repository.fact';
import { LessonModule } from '../lesson/lesson.module';

@Module({
  imports: [
    DataAccessModule,
    TypeOrmModule.forFeature([ClassPersistence]),
    FacultyModule,
    GroupModule,
    WeekModule,
    SemesterModule,
    LessonModule
  ],
  providers: [
    ...ClassUseCases,
    ClassRepository,
    {
      provide: 'IUnitOfWorkFactory',
      useClass: TypeOrmUnitOfWorkFactory,
    },
    {
      provide: 'IClassRepository',
      useClass: ClassRepository,
    },
    {
      provide: 'IRepositoryClassFactory',
      useClass: ClassRepositoryFact,
    },
  ],
  exports: [FindAllClassUseCase, FindAllWithDetailsClassUseCase, ClassRepository],
  controllers: [ClassController],
})
export class ClassModule {
}

