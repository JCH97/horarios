import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { User } from '../../domain/entities/user.entity';
import { Result } from '../../../shared/core/Result';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { Injectable, Logger } from '@nestjs/common';
import { TeacherRepository } from '../../../teacher/infra/repositories/teacher.repository';
import { UserSetAsTeacherDto } from '../dtos/user.set-as-teacher.dto';
import { UserRepository } from 'src/user/infra/repositories/user.repository';
import { Teacher } from '../../../teacher/domain/entities/teacher.entity';
import { UserPermissions } from '../../domain/enums/user.permissions';

export type SetUserAsTeacherUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
  | AppError.ValidationErrorResult<User>,
  Result<User>>;

@Injectable()
export class SetUserAsTeacherUseCase implements IUseCase<UserSetAsTeacherDto, Promise<SetUserAsTeacherUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly userRepository: UserRepository,
  ) {
    this._logger = new Logger('SetUserAsTeacherUseCase');
  }

  async execute(request: UserSetAsTeacherDto): Promise<SetUserAsTeacherUseCaseResponse> {

    const teacher: Teacher = await this.teacherRepository.findById(request.teacherId);

    if (teacher === null)
      return left(Result.Fail(new AppError.ValidationError('Teacher not found')));

    const user = await this.userRepository.findById(request.userId);

    if (user === null)
      return left(Result.Fail(new AppError.ValidationError('User not found')));

    teacher.SetUser({ id: user._id.toString() });
    user.SetNewPermission(UserPermissions.HANDLE_RESTRICTIONS);

    await this.teacherRepository.save(teacher);
    await this.userRepository.save(user);

    return right(Result.Ok(user));
  }
}
