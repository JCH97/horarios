import { Injectable, Logger } from '@nestjs/common';
import { Tree } from '../dtos/tree.dto';
import { ExistInEnum, RowLocations } from '../utils/utils';
import NumberOperators from '../../domain/enums/number_operators';

@Injectable()
export class BuildWhereUseCase {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('BuildWhere');
  }

  build(tree: Tree): any {

    if (!tree.hasOwnProperty('logicalOperator')) {
      if (tree.hasOwnProperty('operator')) { // is a binary operator

        if (ExistInEnum(tree['operator'], NumberOperators))
          return `${RowLocations[tree['rule']]} ${tree['operator']} ${Number(tree['value'])}`;

        return `${RowLocations[tree['rule']]} ${tree['operator']} ${tree['value']}`;

      } else { // is a binary operator but is always with equals (group_id, local_id, day_of_week, etc)

        if (tree['rule'] === 'dayOfWeek')
          return `"class"."dayOfWeek" = ${Number(tree['value'])}`;
        // return `(SELECT EXTRACT (DOW FROM TIMESTAMP ${RowLocations[tree['rule']]})) = ${Number(tree['value'])}`;

        return `${RowLocations[tree['rule']]} = '${tree['value']}'`;
      }
    }

    let logicalOperator = tree['logicalOperator'];

    let ans = ' ( ';
    for (let i = 0; i < tree['children'].length; ++i) {
      const child = tree['children'][i].query;

      const temp = this.build(child);

      ans += temp;
      if (i + 1 < tree['children'].length)
        ans += ` ${logicalOperator === 'all' ? 'AND' : 'OR'} `;
    }
    ans += ' ) ';

    return ans;
  }
}