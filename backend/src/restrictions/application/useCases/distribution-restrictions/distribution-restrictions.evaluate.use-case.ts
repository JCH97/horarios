import { Either, left, right } from '../../../../shared/core/Either';
import { AppError } from '../../../../shared/core/errors/AppError';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import { BuildWhereUseCase } from '../build-where.use-case';
import { ClassRepository } from 'src/class/infra/repositories/class.repository';
import { BodyQuery, BuildInterval, OperaNumbers } from '../../utils/utils';
import { EvaluateRestrictionsResponseDto } from '../../dtos/evaluate-restrictions.response.dto';
import { Tree } from '../../dtos/tree.dto';
import { DistributionRestrictionsRepository } from '../../../infra/repositories/distribution-restrictions.repository';
import { DistributionRestrictions } from '../../../domain/entities/distribution-restriction.entity';

export type EvaluateDistributionRestrictionUseCaseResponse = Either<AppError.UnexpectedErrorResult<EvaluateRestrictionsResponseDto>
  | AppError.ValidationErrorResult<EvaluateRestrictionsResponseDto>,
  Result<EvaluateRestrictionsResponseDto>>;


@Injectable()
export class EvaluateDistributionRestrictionUseCase implements IUseCase<{}, Promise<EvaluateDistributionRestrictionUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly countRestrictionsRepository: DistributionRestrictionsRepository,
    private readonly buildWhere: BuildWhereUseCase,
    private readonly classRepository: ClassRepository,
  ) {
    this._logger = new Logger('EvaluateCountRestrictionsUseCase');
  }

  async execute(request: { teacherId: string }): Promise<EvaluateDistributionRestrictionUseCaseResponse> {
    this._logger.log('Executing...');

    const bodyQuery = BodyQuery;

    const restrictions: DistributionRestrictions[] = (await this.countRestrictionsRepository
      .findAll({ teacherId: request.teacherId }))
      .items;

    try {
      let ans: Set<string> = new Set<string>();
      let amountEvaluation = 1;
      let priorityAmounts = 1;

      for (let t = 0; t < restrictions.length; ++t) {
        const r = restrictions[t];
        const condition = r.condition;
        const where = this.buildWhere.build(condition as Tree);

        const rawQuery = `${bodyQuery} WHERE ${where} ORDER BY "class"."start" ASC`;
        const evaluation = await this.classRepository.executeRawQuery(rawQuery, []);

        let intervals = BuildInterval(evaluation, r.interval);
        let count = 0;
        for (let i = 0; i < intervals.length; ++i) {
          const diffValues = new Set(intervals[i].map(x => x[`class_${r.attribute}`]));

          const evaluation = (OperaNumbers(diffValues.size, r.operator, r.min)) ? 1 : 0;

          if (evaluation == 0)
            ans.add(r._id.toString());

          count += evaluation;
        }

        const final = count / (intervals.length === 0 ? 1 : intervals.length) * r.priority;
        amountEvaluation += final;
        priorityAmounts += r.priority;

        console.log(count, intervals.length, final, evaluation.length);

        // TODO: add r.id if restriction isn't passed. i don't know how handle that
        // ans.push({
        //   restrictionId: r._id.toString(),
        // });
      }
      return right(Result.Ok({
        restrictionId: Array.from(ans),
        evaluation: amountEvaluation,
        priorityAmounts,
      }));

    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
