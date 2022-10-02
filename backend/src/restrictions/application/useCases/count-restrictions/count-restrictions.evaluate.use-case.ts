import { Either, left, right } from '../../../../shared/core/Either';
import { AppError } from '../../../../shared/core/errors/AppError';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import {
  SimpleCountRestrictionsRepository,
} from '../../../infra/repositories/simple-count-restrictions-repository.service';
import { SimpleCountRestrictions } from '../../../domain/entities/count-restriction.entity';
import { BuildWhereUseCase } from '../build-where.use-case';
import { ClassRepository } from 'src/class/infra/repositories/class.repository';
import { BodyQuery, Opera } from '../../utils/utils';
import { EvaluateRestrictionsResponseDto } from '../../dtos/evaluate-restrictions.response.dto';
import { Tree } from '../../dtos/tree.dto';

export type EvaluateCountRestrictionUseCaseResponse = Either<AppError.UnexpectedErrorResult<EvaluateRestrictionsResponseDto>
  | AppError.ValidationErrorResult<EvaluateRestrictionsResponseDto>,
  Result<EvaluateRestrictionsResponseDto>>;


@Injectable()
export class EvaluateSimpleCountRestrictionUseCase implements IUseCase<{}, Promise<EvaluateCountRestrictionUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly countRestrictionsRepository: SimpleCountRestrictionsRepository,
    private readonly buildWhere: BuildWhereUseCase,
    private readonly classRepository: ClassRepository,
  ) {
    this._logger = new Logger('EvaluateCountRestrictionsUseCase');
  }

  async execute(request: { teacherId: string }): Promise<EvaluateCountRestrictionUseCaseResponse> {
    this._logger.log('Executing...');

    const bodyQuery = BodyQuery;

    const restrictions: SimpleCountRestrictions[] = (await this.countRestrictionsRepository
      .findAll({ teacherId: request.teacherId }))
      .items;

    try {
      let ans: Set<string> = new Set<string>();
      let amountEvaluation = 0;
      let priorityAmounts = 0;

      for (let t = 0; t < restrictions.length; ++t) {
        const r = restrictions[t];
        const condition = r.condition;
        const where = this.buildWhere.build(condition as Tree);

        const rawQuery = `${bodyQuery} WHERE ${where} ORDER BY "class"."start" ASC`;
        const evaluation = await this.classRepository.executeRawQuery(rawQuery, []);

        let intervals = [];
        for (let i = 0, k = 0; i < evaluation.length; i += r.interval, ++k) {
          intervals.push([]);

          for (let j = 0; j < r.interval; ++j)
            intervals[k].push(evaluation[i + j]);
        }

        let count = 0;
        if (r.min) {
          for (let i = 0; i < intervals.length; ++i) {
            const evaluation = (Opera(r.min, intervals[i].length, r.operator)) ? 1 : 0;

            if (evaluation == 0)
              ans.add(r._id.toString());

            count += evaluation;

          }
        } else if (r.part) {
          for (let i = 1; i < intervals.length; ++i) {
            const evaluation = (Opera(intervals[i].length, r.part * intervals[i - 1].length, r.operator)) ? 1 : 0;

            if (evaluation == 0)
              ans.add(r._id.toString());

            count += evaluation;
          }
        }
        const final = count / intervals.length * r.priority;
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