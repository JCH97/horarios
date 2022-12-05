import { forwardRef, Module } from '@nestjs/common';
import { DataAccessModule } from '../shared/modules/data-access/data-access.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherPersistence } from './infra/entities/teacher.persistence';
import { FindAllTeacherUseCase, TeacherUseCases } from './application/useCases';
import { TeacherRepository } from './infra/repositories/teacher.repository';
import { TeacherController } from './presentation/controllers/teacher.controller';
import { FacultyModule } from '../faculty/faculty.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    DataAccessModule,
    TypeOrmModule.forFeature([TeacherPersistence]),
    FacultyModule,
    forwardRef(() => UserModule),
  ],
  providers: [...TeacherUseCases, TeacherRepository],
  exports: [TeacherRepository, FindAllTeacherUseCase],
  controllers: [TeacherController],
})
export class TeacherModule {
}

