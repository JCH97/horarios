import { Module } from '@nestjs/common';
import { DataAccessModule } from '../shared/modules/data-access/data-access.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonPersistence } from '../lesson/infra/entities/lesson.persistence';
import { FacultyModule } from '../faculty/faculty.module';
import { FindAllLessonUseCase, FindByIdLessonUseCase, LessonUseCases } from '../lesson/application/useCases';
import { LessonRepository } from '../lesson/infra/repositories/lesson.repository';
import { LessonController } from '../lesson/presentation/controllers/lesson.controller';

@Module({
  imports: [
    DataAccessModule,
    TypeOrmModule.forFeature([LessonPersistence]),
    FacultyModule,
  ],
  providers: [...LessonUseCases, LessonRepository],
  exports: [FindAllLessonUseCase, FindByIdLessonUseCase],
  controllers: [LessonController],
})
export class LessonModule {
}
