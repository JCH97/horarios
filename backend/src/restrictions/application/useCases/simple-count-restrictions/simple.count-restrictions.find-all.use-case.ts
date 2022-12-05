import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '../../../../shared/core/Either';
import { FindAllResult } from '../../../../shared/core/FindAllResult';
import { AppError } from '../../../../shared/core/errors/AppError';
import { SimpleCountRestrictions } from '../../../domain/entities/simple-count-restriction.entity';
import { Result } from '../../../../shared/core/Result';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import { SimpleCountRestrictionsFindAllDto } from '../../dtos/count-restrictions/count-restriction.find-all.dto';
import {
  SimpleCountRestrictionsRepository,
} from '../../../infra/repositories/simple-count-restrictions-repository.service';
import { User } from '../../../../user/domain/entities/user.entity';
import { UserPermissions } from '../../../../user/domain/enums/user.permissions';
import { FindAllTeacherUseCase } from '../../../../teacher/application/useCases';

export type FindAllSimpleCountRestrictionsUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<SimpleCountRestrictions>>
    | AppError.ValidationErrorResult<FindAllResult<SimpleCountRestrictions>>
    | AppError.ObjectNotExistResult<FindAllResult<SimpleCountRestrictions>>,
    Result<FindAllResult<SimpleCountRestrictions>>>;

@Injectable()
export class FindAllSimpleCountRestrictionsUseCase implements IUseCase<SimpleCountRestrictionsFindAllDto, Promise<FindAllSimpleCountRestrictionsUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly simpleCountRestrictionsRepository: SimpleCountRestrictionsRepository,
    private readonly teacherGetAll: FindAllTeacherUseCase) {
    this._logger = new Logger('FindAllSimpleCountRestrictionsUseCase');
  }

  async execute(request: SimpleCountRestrictionsFindAllDto): Promise<FindAllSimpleCountRestrictionsUseCaseResponse> {
    this._logger.log('Executing...');

    if (!User.CheckPermission(UserPermissions.HANDLE_ALL_RESTRICTIONS, request.user.permissions)) {

      const teachers = await this.teacherGetAll.execute({ filter: { userId: request.user.id } });

      if (teachers.isLeft() || teachers.value.unwrap().items.length === 0)
        return left(Result.Fail(new AppError.ObjectNotExist('Teacher')));

      const teacher = teachers.value.unwrap().items[0];

      request.filter = { teacherId: teacher._id.toString() };
    }

    try {
      const ans = await this.simpleCountRestrictionsRepository.findAll(request.filter);
      return right(Result.Ok(ans));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
