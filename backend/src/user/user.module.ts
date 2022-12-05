import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidateUserUseCase } from 'src/auth/application/useCase';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { CreateUserUseCase } from './application/useCases/user.create.use-case';
import { FindByEmailUserUseCase } from './application/useCases/user.findByEmail.use-case';
import { FindByIdUserUseCase } from './application/useCases/user.findById.use-case';
import { UpdateUserUseCase } from './application/useCases/user.update.use-case';
import { UserController } from './presentation/controllers/user.controller';
import { UserPersistence } from './infra/entities/user.persistence';
import { UserRepository } from './infra/repositories/user.repository';
import { PaginatedUserUseCase } from './application/useCases/user.paginate.use-case';
import { TeacherModule } from '../teacher/teacher.module';
import { SetUserAsTeacherUseCase } from './application/useCases/user.set-as-teacher.use-case';
import { FindAllUserUseCase } from './application/useCases/user.get-all.use-case';
import { UserRemovePermissionUseCase } from './application/useCases/user.remove-permission.use-case';

@Module({
  imports: [
    DataAccessModule,
    TypeOrmModule.forFeature([UserPersistence]),
    forwardRef(() => TeacherModule),
  ],
  providers: [
    ValidateUserUseCase,
    CreateUserUseCase,
    FindByEmailUserUseCase,
    FindByIdUserUseCase,
    UserRepository,
    UpdateUserUseCase,
    PaginatedUserUseCase,
    SetUserAsTeacherUseCase,
    FindAllUserUseCase,
    UserRemovePermissionUseCase,
  ],
  controllers: [UserController],
  exports: [
    UserRepository,
    ValidateUserUseCase,
    FindByEmailUserUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    FindByIdUserUseCase,
    UserRemovePermissionUseCase,
  ],
})
export class UserModule {
}
