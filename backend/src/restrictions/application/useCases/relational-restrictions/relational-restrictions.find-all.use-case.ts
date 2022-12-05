import { FindAllResult } from 'src/shared/core/FindAllResult';
import { Either, left, right } from '../../../../shared/core/Either';
import { AppError } from '../../../../shared/core/errors/AppError';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import { User } from '../../../../user/domain/entities/user.entity';
import { UserPermissions } from '../../../../user/domain/enums/user.permissions';
import { FindAllTeacherUseCase } from '../../../../teacher/application/useCases';
import { RelationalRestrictions } from 'src/restrictions/domain/entities/RelationalRequirement';
import {
  RelationalRestrictionsFindAllDto
} from '../../dtos/relational-restrictions/relational-restrictions.find-all.dto';
import { RelationalRestrictionsRepository } from '../../../infra/repositories/relational-restriction.repository';

export type FindAllRelationalRestrictionsUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<RelationalRestrictions>>
    | AppError.ValidationErrorResult<FindAllResult<RelationalRestrictions>>
    | AppError.ObjectNotExistResult<FindAllResult<RelationalRestrictions>>,
    Result<FindAllResult<RelationalRestrictions>>>;

@Injectable()
export class FindAllRelationalRestrictionsUseCase implements IUseCase<RelationalRestrictionsFindAllDto, Promise<FindAllRelationalRestrictionsUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly relationalRestrictionsRepository: RelationalRestrictionsRepository,
    private readonly teacherGetAll: FindAllTeacherUseCase) {
    this._logger = new Logger('FindAllRelationalRestrictionsUseCase');
  }

  async execute(request: RelationalRestrictionsFindAllDto): Promise<FindAllRelationalRestrictionsUseCaseResponse> {
    this._logger.log('Executing...');

    if (!User.CheckPermission(UserPermissions.HANDLE_ALL_RESTRICTIONS, request.user.permissions)) {

      const teachers = await this.teacherGetAll.execute({ filter: { userId: request.user.id } });

      if (teachers.isLeft() || teachers.value.unwrap().items.length === 0)
        return left(Result.Fail(new AppError.ObjectNotExist('Teacher')));

      const teacher = teachers.value.unwrap().items[0];

      request.filter = { teacherId: teacher._id.toString() };
    }

    try {
      const ans = await this.relationalRestrictionsRepository.findAll(request.filter);
      return right(Result.Ok(ans));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
