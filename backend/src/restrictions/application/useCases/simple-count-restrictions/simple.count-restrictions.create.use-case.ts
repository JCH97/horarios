import { Either, left, right } from '../../../../shared/core/Either';
import { AppError } from '../../../../shared/core/errors/AppError';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import { SimpleCountRestrictionsDto } from '../../dtos/count-restrictions/simple-count-restrictions.dto';
import {
  SimpleCountRestrictionsRepository,
} from '../../../infra/repositories/simple-count-restrictions-repository.service';
import { SimpleCountRestrictions } from '../../../domain/entities/simple-count-restriction.entity';
import { CountRestrictionsCreateDto } from '../../dtos/count-restrictions/count-restrictions.create.dto';
import { RestrictionType } from '../../../domain/enums/restriction-type';
import { FindByIdUserUseCase } from '../../../../user/application/useCases/user.findById.use-case';
import { FindAllTeacherUseCase } from '../../../../teacher/application/useCases';

export type CreateSimpleCountRestrictionUseCaseResponse = Either<AppError.UnexpectedErrorResult<SimpleCountRestrictions>
  | AppError.ValidationErrorResult<SimpleCountRestrictions>
  | AppError.ObjectNotExistResult<SimpleCountRestrictions>,
  Result<SimpleCountRestrictions>>;


@Injectable()
export class CreateSimpleCountRestrictionUseCase implements IUseCase<SimpleCountRestrictionsDto, Promise<CreateSimpleCountRestrictionUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly countRestrictionsRepository: SimpleCountRestrictionsRepository,
    private readonly userFindById: FindByIdUserUseCase,
    private readonly teacherGetAll: FindAllTeacherUseCase,
  ) {
    this._logger = new Logger('CreateSimpleCountRestrictionsUseCase');
  }

  async execute(request: CountRestrictionsCreateDto): Promise<CreateSimpleCountRestrictionUseCaseResponse> {
    this._logger.log('Executing...');

    const teachers = await this.teacherGetAll.execute({
      filter: [
        { userId: request.teacherId.id },
        { id: request.teacherId.id },
      ],
    });

    if (teachers.isLeft() || teachers.value.unwrap().items.length === 0)
      return left(Result.Fail(new AppError.ObjectNotExist('Teacher not found')));

    if (!request.conditions)
      return left(Result.Fail(new AppError.ValidationError('Conditions not found')));

    const teacher = teachers.value.unwrap().items[0];

    request.teacherId = { id: teacher._id.toString() };

    const countRestrictionsOrError: Result<SimpleCountRestrictions> = SimpleCountRestrictions.New({
      ...request,
      conditions: JSON.parse(request.conditions),
      restrictionType: RestrictionType.SimpleCountRestriction,
    });

    if (countRestrictionsOrError.isFailure)
      return left(countRestrictionsOrError);

    const countRestrictions: SimpleCountRestrictions = countRestrictionsOrError.unwrap();

    try {
      await this.countRestrictionsRepository.save(countRestrictions);

      return right(Result.Ok(countRestrictions));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}