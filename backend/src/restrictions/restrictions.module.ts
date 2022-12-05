import { Module } from '@nestjs/common';
import { DataAccessModule } from '../shared/modules/data-access/data-access.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestrictionsUseCases } from './application/useCases';
import { ClassModule } from '../class/class.module';
import { RestrictionsRepositories } from './infra/repositories';
import { Controllers } from './presentation/controllers';
import { TeacherModule } from '../teacher/teacher.module';
import { UserModule } from '../user/user.module';
import { RestrictionsPersistence } from './infra/entities';

@Module({
  imports: [
    DataAccessModule,
    TypeOrmModule.forFeature([
      ...RestrictionsPersistence,
    ]),
    ClassModule,
    TeacherModule,
    UserModule,
  ],
  providers: [
    ...RestrictionsUseCases,
    ...RestrictionsRepositories,
  ],
  exports: [],
  controllers: [...Controllers],
})
export class RestrictionsModule {
}