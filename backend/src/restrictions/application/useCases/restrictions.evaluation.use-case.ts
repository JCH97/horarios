import { Injectable, Logger } from '@nestjs/common';
import { ClassRepository } from '../../../class/infra/repositories/class.repository';
import { TeacherRepository } from '../../../teacher/infra/repositories/teacher.repository';
import {
  EvaluateSimpleCountRestrictionUseCase,
} from './simple-count-restrictions/simple.count-restrictions.evaluate.use-case';
import {
  EvaluateCountConditionsRestrictionsUseCase,
} from './count-conditions-restrictions/count-conditions.restrictions.evaluate.use-case';
import { Either, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Result } from '../../../shared/core/Result';
import { HappinessDto } from '../dtos/happiness.dto';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { RestrictionType } from '../../domain/enums/restriction-type';
import {
  EvaluateDistributionRestrictionUseCase,
} from './distribution-restrictions/distribution-restrictions.evaluate.use-case';
import {
  EvaluateRelationalRestrictionsUseCase,
} from './relational-restrictions/relational-restrictions.evaluate.use-case';

export type EvaluateRestrictionsUseCaseResponse = Either<AppError.UnexpectedErrorResult<HappinessDto>
  | AppError.ValidationErrorResult<HappinessDto>,
  Result<HappinessDto>>;

@Injectable()
export class RestrictionsEvaluationUseCase implements IUseCase<{}, Promise<EvaluateRestrictionsUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly classRepository: ClassRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly evaluateSimpleCountRestrictions: EvaluateSimpleCountRestrictionUseCase,
    private readonly evaluateCountConditionsRestrictions: EvaluateCountConditionsRestrictionsUseCase,
    private readonly evaluateDistributionRestrictions: EvaluateDistributionRestrictionUseCase,
    private readonly relationalRestriction: EvaluateRelationalRestrictionsUseCase,
  ) {
    this._logger = new Logger('RestrictionsEvaluationUseCase');
  }

  async execute(): Promise<EvaluateRestrictionsUseCaseResponse> {
    this._logger.log('Executing');

    let priorityCount = 0;
    let accomplishCount = 0;
    let breachedRestrictions: Set<[string, string, RestrictionType]> = new Set<[string, string, RestrictionType]>();


    // const classes = (await this.classRepository.findAll({})).items;
    const teachers = (await this.teacherRepository.findAll({})).items;

    for (let i = 0; i < teachers.length; ++i) {
      const t = teachers[i];
      this._logger.debug(`Teacher: ${t.shortName} --  ${t._id.toString()}`);

      let teacherPriorityCount = 0;
      let teacherAccomplishCount = 0;

      const val1 = await this.evaluateSimpleCountRestrictions.execute({ teacherId: t._id.toString() });
      const val2 = await this.evaluateCountConditionsRestrictions.execute({ teacherId: t._id.toString() });
      const val3 = await this.evaluateDistributionRestrictions.execute({ teacherId: t._id.toString() });
      const val4 = await this.relationalRestriction.execute({ teacherId: t._id.toString() });

      if (val1.isRight() && val2.isRight() && val3.isRight()) {
        let u1 = val1.value.unwrap();
        let u2 = val2.value.unwrap();
        let u3 = val3.value.unwrap();
        let u4 = val4.value.unwrap();

        this._logger.debug(`Simple Count Restrictions: ${JSON.stringify(u1)}`);
        this._logger.debug(`Count Conditional Restrictions: ${JSON.stringify(u2)}`);
        this._logger.debug(`Distribution Restrictions: ${JSON.stringify(u3)}`);
        this._logger.debug(`Relational Restrictions: ${JSON.stringify(u4)}`);

        teacherAccomplishCount += (u1.evaluation + u2.evaluation + u3.evaluation + u4.evaluation);
        teacherPriorityCount += (u1.priorityAmounts + u2.priorityAmounts + u2.priorityAmounts + u4.priorityAmounts);

        u1.restrictionId.forEach(r => breachedRestrictions.add([r, t._id.toString(), RestrictionType.SimpleCountRestriction]));
        u2.restrictionId.forEach(r => breachedRestrictions.add([r, t._id.toString(), RestrictionType.CountConditionsRestriction]));
        u3.restrictionId.forEach(r => breachedRestrictions.add([r, t._id.toString(), RestrictionType.DistributionRestrictions]));
        u4.restrictionId.forEach(r => breachedRestrictions.add([r, t._id.toString(), RestrictionType.RelationalRestrictions]));

        priorityCount += t.priority;

        accomplishCount += teacherAccomplishCount / (teacherPriorityCount == 0 ? 1 : teacherPriorityCount) * t.priority;

        this._logger.verbose(`Teacher ${t.shortName} Results: -- SimpleCount: ${u1.evaluation} -- CountConditions: ${u2.evaluation} -- DistributionRestrictions: ${u3.evaluation} -- RelationalRestrictions: ${u4.evaluation}`);
      }
    }

    this._logger.debug(`${accomplishCount} ${priorityCount} Happiness: ${accomplishCount / (priorityCount == 0 ? 1 : priorityCount)}`);

    return right(Result.Ok<HappinessDto>({
      happiness: accomplishCount / (priorityCount == 0 ? 1 : priorityCount),
      breachedRestrictions: Array.from(breachedRestrictions).map(r => {
        return {
          id: r[0],
          teacherId: r[1],
          restrictionType: r[2],
        };
      }),
    }));
  }
}