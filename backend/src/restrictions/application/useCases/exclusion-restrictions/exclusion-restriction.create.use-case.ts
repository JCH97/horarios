import { Either, left, right } from '../../../../shared/core/Either';
import { AppError } from '../../../../shared/core/errors/AppError';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import { RestrictionType } from '../../../domain/enums/restriction-type';
import { FindByIdUserUseCase } from '../../../../user/application/useCases/user.findById.use-case';
import { ExclusionRestrictions } from '../../../domain/entities/exclusion-restriction.entity';
import { FindAllTeacherUseCase } from '../../../../teacher/application/useCases';
import { ExclusionRestrictionsDto } from '../../dtos/exclusion-restriction/exclusion-restrictions.dto';
import { ExclusionRestrictionsRepository } from '../../../infra/repositories/exclusion-restriction.repository';
import { ExclusionRestrictionsCreateDto } from '../../dtos/exclusion-restriction/exclusion-restrictions.create.dto';

export type CreateExclusionRestrictionUseCaseResponse = Either<AppError.UnexpectedErrorResult<ExclusionRestrictions>
  | AppError.ValidationErrorResult<ExclusionRestrictions>
  | AppError.ObjectNotExistResult<ExclusionRestrictions>,
  Result<ExclusionRestrictions>>;


@Injectable()
export class CreateExclusionRestrictionUseCase implements IUseCase<ExclusionRestrictionsDto, Promise<CreateExclusionRestrictionUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly countRestrictionsRepository: ExclusionRestrictionsRepository,
    private readonly userFindById: FindByIdUserUseCase,
    private readonly teacherGetAll: FindAllTeacherUseCase,
  ) {
    this._logger = new Logger('CreateExclusionRestrictionsUseCase');
  }

  async execute(request: ExclusionRestrictionsCreateDto): Promise<CreateExclusionRestrictionUseCaseResponse> {
    this._logger.log('Executing...');

    const teachers = await this.teacherGetAll.execute({ filter: { userId: request.teacherId.id } });

    if (teachers.isLeft() || teachers.value.unwrap().items.length === 0)
      return left(Result.Fail(new AppError.ObjectNotExist('Teacher not found')));

    if (!request.conditions)
      return left(Result.Fail(new AppError.ValidationError('Conditions not found')));

    const teacher = teachers.value.unwrap().items[0];

    request.teacherId = { id: teacher._id.toString() };

    const countRestrictionsOrError: Result<ExclusionRestrictions> = ExclusionRestrictions.New({
      ...request,
      conditions: JSON.parse(request.conditions),
      restrictionType: RestrictionType.ExclusionRestrictions,
    });

    if (countRestrictionsOrError.isFailure)
      return left(countRestrictionsOrError);

    const countRestrictions: ExclusionRestrictions = countRestrictionsOrError.unwrap();

    try {
      await this.countRestrictionsRepository.save(countRestrictions);

      return right(Result.Ok(countRestrictions));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
