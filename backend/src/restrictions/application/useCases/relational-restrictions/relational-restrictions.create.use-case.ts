import { Either, left, right } from '../../../../shared/core/Either';
import { AppError } from '../../../../shared/core/errors/AppError';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import { RestrictionType } from '../../../domain/enums/restriction-type';
import { FindByIdUserUseCase } from '../../../../user/application/useCases/user.findById.use-case';
import { FindAllTeacherUseCase } from '../../../../teacher/application/useCases';
import { RelationalRestrictions } from '../../../domain/entities/RelationalRequirement';
import { RelationalRestrictionsDto } from '../../dtos/relational-restrictions/relational-restrictions.dto';
import { RelationalRestrictionsRepository } from '../../../infra/repositories/relational-restriction.repository';
import { RelationalRestrictionsCreateDto } from '../../dtos/relational-restrictions/relational-restrictions.create.dto';

export type CreateRelationalRestrictionsUseCaseResponse = Either<AppError.UnexpectedErrorResult<RelationalRestrictions>
  | AppError.ValidationErrorResult<RelationalRestrictions>
  | AppError.ObjectNotExistResult<RelationalRestrictions>,
  Result<RelationalRestrictions>>;


@Injectable()
export class CreateRelationalRestrictionsUseCase implements IUseCase<RelationalRestrictionsDto, Promise<CreateRelationalRestrictionsUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly relationalRestrictionsRepository: RelationalRestrictionsRepository,
    private readonly userFindById: FindByIdUserUseCase,
    private readonly teacherGetAll: FindAllTeacherUseCase,
  ) {
    this._logger = new Logger('CreateRelationalRestrictionsUseCase');
  }

  async execute(request: RelationalRestrictionsCreateDto): Promise<CreateRelationalRestrictionsUseCaseResponse> {
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

    const relationalRestrictionsOrError: Result<RelationalRestrictions> = RelationalRestrictions.New({
      ...request,
      conditions: JSON.parse(request.conditions),
      subConditions: JSON.parse(request.subConditions),
      restrictionType: RestrictionType.RelationalRestrictions,
    });

    if (relationalRestrictionsOrError.isFailure)
      return left(relationalRestrictionsOrError);

    const relationalRestrictions: RelationalRestrictions = relationalRestrictionsOrError.unwrap();

    try {
      await this.relationalRestrictionsRepository.save(relationalRestrictions);

      return right(Result.Ok(relationalRestrictions));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
