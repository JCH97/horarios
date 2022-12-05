import { FindAllResult } from 'src/shared/core/FindAllResult';
import { Either, left, right } from '../../../../shared/core/Either';
import { AppError } from '../../../../shared/core/errors/AppError';
import { CountConditionsRestrictions } from '../../../domain/entities/count-conditions.restrictions.entity';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import {
  CountConditionsRestrictionsFindAllDto,
} from '../../dtos/count-conditions-restrictions/count-conditions.restrictions.find-all.dto';
import {
  CountConditionsRestrictionsRepository,
} from '../../../infra/repositories/count-conditions.restrictions.repository';
import { User } from '../../../../user/domain/entities/user.entity';
import { UserPermissions } from '../../../../user/domain/enums/user.permissions';
import { FindAllTeacherUseCase } from '../../../../teacher/application/useCases';

export type FindAllCountConditionsRestrictionsUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<CountConditionsRestrictions>>
    | AppError.ValidationErrorResult<FindAllResult<CountConditionsRestrictions>>
    | AppError.ObjectNotExistResult<FindAllResult<CountConditionsRestrictions>>,
    Result<FindAllResult<CountConditionsRestrictions>>>;

@Injectable()
export class FindAllCountConditionsRestrictionsUseCase implements IUseCase<CountConditionsRestrictionsFindAllDto, Promise<FindAllCountConditionsRestrictionsUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly countConditionsRestrictionsRepository: CountConditionsRestrictionsRepository,
    private readonly teacherGetAll: FindAllTeacherUseCase) {
    this._logger = new Logger('FindAllCountConditionsRestrictionsUseCase');
  }

  async execute(request: CountConditionsRestrictionsFindAllDto): Promise<FindAllCountConditionsRestrictionsUseCaseResponse> {
    this._logger.log('Executing...');

    if (!User.CheckPermission(UserPermissions.HANDLE_ALL_RESTRICTIONS, request.user.permissions)) {

      const teachers = await this.teacherGetAll.execute({ filter: { userId: request.user.id } });

      if (teachers.isLeft() || teachers.value.unwrap().items.length === 0)
        return left(Result.Fail(new AppError.ObjectNotExist('Teacher')));

      const teacher = teachers.value.unwrap().items[0];

      request.filter = { teacherId: teacher._id.toString() };
    }

    try {
      const ans = await this.countConditionsRestrictionsRepository.findAll(request.filter);
      return right(Result.Ok(ans));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
