import { Either, left, right } from '../../../../shared/core/Either';
import { AppError } from '../../../../shared/core/errors/AppError';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import { RestrictionType } from '../../../domain/enums/restriction-type';
import { CountConditionsRestrictions } from '../../../domain/entities/count-conditions.restrictions.entity';
import {
  CountConditionsRestrictionsDto,
} from '../../dtos/count-conditions-restrictions/count-conditions-restrictions.dto';
import {
  CountConditionsRestrictionsRepository,
} from '../../../infra/repositories/count-conditions.restrictions.repository';
import {
  CountConditionsRestrictionsCreateDto,
} from '../../dtos/count-conditions-restrictions/count-conditions.create.dto';
import { FindByIdUserUseCase } from '../../../../user/application/useCases/user.findById.use-case';
import { FindAllTeacherUseCase } from '../../../../teacher/application/useCases';

export type CreateCountConditionsRestrictionsUseCaseResponse = Either<AppError.UnexpectedErrorResult<CountConditionsRestrictions>
  | AppError.ValidationErrorResult<CountConditionsRestrictions>
  | AppError.ObjectNotExistResult<CountConditionsRestrictions>,
  Result<CountConditionsRestrictions>>;


@Injectable()
export class CreateCountConditionsRestrictionsUseCase implements IUseCase<CountConditionsRestrictionsDto, Promise<CreateCountConditionsRestrictionsUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly countConditionsRestrictionsRepository: CountConditionsRestrictionsRepository,
    private readonly userFindById: FindByIdUserUseCase,
    private readonly teacherGetAll: FindAllTeacherUseCase,
  ) {
    this._logger = new Logger('CreateCountConditionsRestrictionsUseCase');
  }

  async execute(request: CountConditionsRestrictionsCreateDto): Promise<CreateCountConditionsRestrictionsUseCaseResponse> {
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

    const countConditionsRestrictionsOrError: Result<CountConditionsRestrictions> = CountConditionsRestrictions.New({
      ...request,
      conditions: JSON.parse(request.conditions),
      subConditions: JSON.parse(request.subConditions),
      restrictionType: RestrictionType.CountConditionsRestriction,
    });

    if (countConditionsRestrictionsOrError.isFailure)
      return left(countConditionsRestrictionsOrError);

    const countConditionsRestrictions: CountConditionsRestrictions = countConditionsRestrictionsOrError.unwrap();

    try {
      await this.countConditionsRestrictionsRepository.save(countConditionsRestrictions);

      return right(Result.Ok(countConditionsRestrictions));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
