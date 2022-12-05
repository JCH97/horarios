import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '../../../../shared/core/Either';
import { FindAllResult } from '../../../../shared/core/FindAllResult';
import { AppError } from '../../../../shared/core/errors/AppError';
import { Result } from '../../../../shared/core/Result';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import { ExclusionRestrictions } from 'src/restrictions/domain/entities/exclusion-restriction.entity';
import { UserPermissions } from '../../../../user/domain/enums/user.permissions';
import { User } from '../../../../user/domain/entities/user.entity';
import { FindAllTeacherUseCase } from '../../../../teacher/application/useCases';
import { ExclusionRestrictionsFindAllDto } from '../../dtos/exclusion-restriction/exclusion-restriction.find-all.dto';
import { ExclusionRestrictionsRepository } from '../../../infra/repositories/exclusion-restriction.repository';

export type FindAllExclusionRestrictionsUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<ExclusionRestrictions>>
    | AppError.ValidationErrorResult<FindAllResult<ExclusionRestrictions>>
    | AppError.ObjectNotExistResult<FindAllResult<ExclusionRestrictions>>,
    Result<FindAllResult<ExclusionRestrictions>>>;

@Injectable()
export class FindAllExclusionRestrictionsUseCase implements IUseCase<ExclusionRestrictionsFindAllDto, Promise<FindAllExclusionRestrictionsUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly exclusionRestrictionsRepository: ExclusionRestrictionsRepository,
    private readonly teacherGetAll: FindAllTeacherUseCase) {
    this._logger = new Logger('FindAllExclusionRestrictionsUseCase');
  }

  async execute(request: ExclusionRestrictionsFindAllDto): Promise<FindAllExclusionRestrictionsUseCaseResponse> {
    this._logger.log('Executing...');

    if (!User.CheckPermission(UserPermissions.HANDLE_ALL_RESTRICTIONS, request.user.permissions)) {
      const teachers = await this.teacherGetAll.execute({ filter: { userId: request.user.id } });

      if (teachers.isLeft() || teachers.value.unwrap().items.length === 0)
        return left(Result.Fail(new AppError.ObjectNotExist('Teacher')));

      const teacher = teachers.value.unwrap().items[0];

      request.filter = { teacherId: teacher._id.toString() };
    }

    try {
      const ans = await this.exclusionRestrictionsRepository.findAll(request.filter);
      return right(Result.Ok(ans));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
