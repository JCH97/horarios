import { Injectable, Logger } from '@nestjs/common';
import {
  CountConditionsRestrictionsRepository,
} from '../../infra/repositories/count-conditions.restrictions.repository';
import { DistributionRestrictionsRepository } from '../../infra/repositories/distribution-restrictions.repository';
import { RelationalRestrictionsRepository } from '../../infra/repositories/relational-restriction.repository';
import {
  SimpleCountRestrictionsRepository,
} from '../../infra/repositories/simple-count-restrictions-repository.service';

@Injectable()
export class GetRestrictionsDescriptionsByTeacher {

  private _logger: Logger;

  constructor(
    private readonly countConditionsRestrictionsRepository: CountConditionsRestrictionsRepository,
    private readonly distributionRestrictionsRepository: DistributionRestrictionsRepository,
    // private readonly exclusionRestrictionsRepository: ExclusionRestrictionsRepository,
    private readonly relationalRestrictionsRepository: RelationalRestrictionsRepository,
    private readonly simpleCountRestrictionsRepository: SimpleCountRestrictionsRepository,
  ) {
    this._logger = new Logger('GetRestrictionsDescriptionsByTeacher');
  }

  async execute(request: { teachers: string[] }): Promise<string[]> {
    this._logger.log('Executing...');

    const restCountConditions = (await (await this.countConditionsRestrictionsRepository.getQueryBuilder('count_conditions_restrictions'))
      .select(['count_conditions_restrictions.description'])
      .where('teacher_id IN (:...teacherIds)', { teacherIds: request.teachers })
      .getMany())
      .map((r) => r.description);

    const restDistribution = (await (await this.distributionRestrictionsRepository.getQueryBuilder('distribution_restrictions'))
      .select(['distribution_restrictions.description'])
      .where('teacher_id IN (:...teacherIds)', { teacherIds: request.teachers })
      .getMany())
      .map((r) => r.description);

    const restRelational = (await (await this.relationalRestrictionsRepository.getQueryBuilder('relational_restrictions'))
      .select(['relational_restrictions.description'])
      .where('teacher_id IN (:...teacherIds)', { teacherIds: request.teachers })
      .getMany())
      .map((r) => r.description);

    const restSimpleCount = (await (await this.simpleCountRestrictionsRepository.getQueryBuilder('count_simple_restrictions'))
      .select(['count_simple_restrictions.description'])
      .where('teacher_id IN (:...teacherIds)', { teacherIds: request.teachers })
      .getMany())
      .map((r) => r.description);
    
     return  restCountConditions.concat(restDistribution, restRelational, restSimpleCount);
  }
}