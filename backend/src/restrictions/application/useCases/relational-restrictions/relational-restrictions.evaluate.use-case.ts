import { Either, left, right } from '../../../../shared/core/Either';
import { AppError } from '../../../../shared/core/errors/AppError';
import { Result } from '../../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../../shared/core/interfaces/IUseCase';
import { BuildWhereUseCase } from '../build-where.use-case';
import { ClassRepository } from 'src/class/infra/repositories/class.repository';
import { BodyQuery, BuildInterval, OperaSet } from '../../utils/utils';
import { Tree } from '../../dtos/tree.dto';
import { EvaluateRestrictionsResponseDto } from '../../dtos/evaluate-restrictions.response.dto';
import { RelationalRestrictionsRepository } from '../../../infra/repositories/relational-restriction.repository';
import { RelationalRestrictions } from '../../../domain/entities/RelationalRequirement';
import { ClassMappers } from '../../../../class/infra/mappers/class.mapper';

export type EvaluateRelationalRestrictionsUseCaseResponse = Either<AppError.UnexpectedErrorResult<EvaluateRestrictionsResponseDto>
  | AppError.ValidationErrorResult<EvaluateRestrictionsResponseDto>,
  Result<EvaluateRestrictionsResponseDto>>;


@Injectable()
export class EvaluateRelationalRestrictionsUseCase implements IUseCase<{}, Promise<EvaluateRelationalRestrictionsUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly relationalRestrictionsRepository: RelationalRestrictionsRepository,
    private readonly buildWhere: BuildWhereUseCase,
    private readonly classRepository: ClassRepository,
  ) {
    this._logger = new Logger('EvaluateRelationalRestrictionsUseCase');
  }

  async execute(request: { teacherId: string }): Promise<EvaluateRelationalRestrictionsUseCaseResponse> {
    this._logger.log('Executing...');

    const bodyQuery = BodyQuery;

    const restrictions: RelationalRestrictions[] = (await this.relationalRestrictionsRepository
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
        const rawQuery2 = `${bodyQuery} WHERE ${whereSubCondition}  ORDER BY "class"."start" ASC`;

        const set1 = await this.classRepository.executeRawQuery(rawQuery1, []);
        const set2 = await this.classRepository.executeRawQuery(rawQuery2, []);

        let idsSet1: Set<string> = new Set(set1.map(x => x['class_id'] || x.id));
        let idsSet2: Set<string> = new Set(set2.map(x => x['class_id'] || x.id));

        let count = 0;
        for (let i = 0; i < temporalInterval.length; ++i) {
          let valuesSet1 = new Set();
          let valuesSet2 = new Set();
          for (let j = 0; j < temporalInterval[i].length; ++j) {

            let element = ClassMappers.DomainToDto(temporalInterval[i][j]);

            let existInSet1 = idsSet1.has(element['class_id'] || element.id);
            let existInSet2 = idsSet2.has(element['class_id'] || element.id);

            if (existInSet1) valuesSet1.add(element[r.attribute]);
            if (existInSet2) valuesSet2.add(element[r.attribute]);
          }


          // if (valuesSet1.size > 0 && valuesSet2.size > 0) {
          let evaluation = OperaSet(valuesSet1, r.operator, valuesSet2) ? 1 : 0;

          if (evaluation === 0)
            ans.add(r._id.toString());

          count += evaluation;
          // }
        }

        const final = temporalInterval.length === 0 ? 0 : count / temporalInterval.length;
        amountEvaluation += final;
        priorityAmounts += r.priority;

        console.log(count, temporalInterval.length, final, set1.length, set2.length);

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
