import { Either, left, right } from '../../../../shared/core/Either';
import { AppError } from '../../../../shared/core/errors/AppError';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import { BuildWhereUseCase } from '../build-where.use-case';
import { ClassRepository } from 'src/class/infra/repositories/class.repository';
import { BodyQuery, BuildInterval, OperaNumbers } from '../../utils/utils';
import { Tree } from '../../dtos/tree.dto';
import { EvaluateRestrictionsResponseDto } from '../../dtos/evaluate-restrictions.response.dto';
import {
  CountConditionsRestrictionsRepository,
} from '../../../infra/repositories/count-conditions.restrictions.repository';
import { CountConditionsRestrictions } from '../../../domain/entities/count-conditions.restrictions.entity';

export type EvaluateCountConditionsRestrictionsUseCaseResponse = Either<AppError.UnexpectedErrorResult<EvaluateRestrictionsResponseDto>
  | AppError.ValidationErrorResult<EvaluateRestrictionsResponseDto>,
  Result<EvaluateRestrictionsResponseDto>>;


@Injectable()
export class EvaluateCountConditionsRestrictionsUseCase implements IUseCase<{}, Promise<EvaluateCountConditionsRestrictionsUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly countConditionsRestrictionsRepository: CountConditionsRestrictionsRepository,
    private readonly buildWhere: BuildWhereUseCase,
    private readonly classRepository: ClassRepository,
  ) {
    this._logger = new Logger('EvaluateCountConditionsRestrictionsUseCase');
  }

  async execute(request: { teacherId: string }): Promise<EvaluateCountConditionsRestrictionsUseCaseResponse> {
    this._logger.log('Executing...');

    const bodyQuery = BodyQuery;

    const restrictions: CountConditionsRestrictions[] = (await this.countConditionsRestrictionsRepository
      .findAll({ teacherId: request.teacherId }))
      .items;

    const classes = (await this.classRepository.findAll({}, { start: 'ASC' })).items;

    try {
      let ans: Set<string> = new Set<string>();
      let amountEvaluation = 1;
      let priorityAmounts = 1;

      for (let t = 0; t < restrictions.length; ++t) {

        const r = restrictions[t];
        const condition = r.condition;

        let temporalInterval = BuildInterval(classes, r.interval);

        const whereCondition = this.buildWhere.build(condition as Tree);
        const rawQuery1 = `${bodyQuery} WHERE ${whereCondition} ORDER BY "class"."start" ASC`;

        const whereSubCondition = this.buildWhere.build(r.subConditions as Tree);
        const rawQuery2 = `${bodyQuery} WHERE ${whereCondition} AND ${whereSubCondition}  ORDER BY "class"."start" ASC`;

        const evaluation = await this.classRepository.executeRawQuery(rawQuery1, []);
        const evaluationBoth = await this.classRepository.executeRawQuery(rawQuery2, []);

        let interval = [];
        let intervalBoth = [];

        let idsEvaluation: Set<string> = new Set(evaluation.map(x => x['class_id'] || x.id));
        let idsEvaluationBoth: Set<string> = new Set(evaluationBoth.map(x => x['class_id'] || x.id));

        for (let i = 0; i < temporalInterval.length; ++i) {
          interval.push([]);
          intervalBoth.push([]);
          for (let j = 0; j < temporalInterval[i].length; ++j) {
            let element = temporalInterval[i][j].props.id;

            let existInInterval = idsEvaluation.has(element);
            let existInBothInterval = idsEvaluationBoth.has(element);

            if (existInInterval) interval[i].push(element);
            if (existInBothInterval) intervalBoth[i].push(element);
          }
        }

        let count = 0;
        for (let i = 0; i < intervalBoth.length; ++i) {
          const evaluation = (OperaNumbers(intervalBoth[i].length, r.operator, r.part * interval[i].length)) ? 1 : 0;

          if (evaluation == 0)
            ans.add(r._id.toString());

          count += evaluation;

        }

        const final = count / (intervalBoth.length === 0 ? 1 : intervalBoth.length) * r.priority;
        amountEvaluation += final;
        priorityAmounts += r.priority;

        console.log(count, temporalInterval.length, final, evaluation.length);

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
