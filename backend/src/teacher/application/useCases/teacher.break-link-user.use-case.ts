import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Result } from '../../../shared/core/Result';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { Injectable, Logger } from '@nestjs/common';
import { TeacherRepository } from '../../../teacher/infra/repositories/teacher.repository';
import { Teacher } from '../../../teacher/domain/entities/teacher.entity';
import { UserRemovePermissionUseCase } from '../../../user/application/useCases/user.remove-permission.use-case';
import { UserPermissions } from '../../../user/domain/enums/user.permissions';

export type TeacherBreakUserLinkUseCaseResponse = Either<AppError.UnexpectedErrorResult<Teacher>
  | AppError.ValidationErrorResult<Teacher>,
  Result<Teacher>>;

@Injectable()
export class TeacherBreakUserLinkUseCase implements IUseCase<{ teacherId: string }, Promise<TeacherBreakUserLinkUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly userRemovePermission: UserRemovePermissionUseCase,
  ) {
    this._logger = new Logger('TeacherBreakUserLinkUseCase');
  }

  async execute(request: { teacherId: string }): Promise<TeacherBreakUserLinkUseCaseResponse> {

    this._logger.log('Executing...');

    const teacher: Teacher = await this.teacherRepository.findById(request.teacherId);

    if (teacher === null)
      return left(Result.Fail(new AppError.ValidationError('Teacher not found')));

    const userId = teacher.userId.id;

    teacher.SetUser({ id: null });

    await this.teacherRepository.save(teacher);

    await this.userRemovePermission.execute({
      userId,
      permission: UserPermissions.HANDLE_RESTRICTIONS,
    });

    return right(Result.Ok(teacher));
  }
}
