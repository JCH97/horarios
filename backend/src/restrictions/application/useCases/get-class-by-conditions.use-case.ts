import { Injectable, Logger } from '@nestjs/common';
import { ClassRepository } from '../../../class/infra/repositories/class.repository';
import { Conditions } from '../../domain/entities/conditions';

@Injectable()
export class GetClassesByConditions {

  private _logger: Logger;

  constructor(private readonly classRepository: ClassRepository) {
    this._logger = new Logger('GetClassesByConditions');
  }

  async execute(request: { conditions: Conditions[] }): Promise<number> {
    let qB = (await this
      .classRepository
      .getQueryBuilder('class'));

    for (let i = 0; i < request.conditions.length; ++i) {
      const c = request.conditions[i];

      switch (c.Attribute) {

        case Attributes.Start:
          qB = qB.andWhere(`class.start ${c.Operator} :start`, { start: new Date(c.Value) });
          break;
        case Attributes.End:
          qB = qB.andWhere(`class.end ${c.Operator} :endDate`, { endDate: new Date(c.Value) });
          break;
        case Attributes.Group:
          qB = qB.andWhere(`class.groupId ${c.Operator} :groupId`, { groupId: c.Value });
          break;
        case Attributes.Local:
          qB = qB.andWhere(`class.localId ${c.Operator} :localId`, { localId: c.Value });
          break;
        case Attributes.TypeClass:
          qB = qB.andWhere(`class.typeClassId ${c.Operator} :typeClassId`, { typeClassId: c.Value });
          break;
        case Attributes.Lesson:
          qB = qB.andWhere(`class.lessonId ${c.Operator} :lessonId`, { lessonId: c.Value });
          break;
        case Attributes.Major:
          qB = qB.andWhere(`class.majorId ${c.Operator} :majorId`, { majorId: c.Value });
          break;
        case Attributes.Teacher:
          qB = qB.andWhere(`class.teacherId ${c.Operator} :teacherId`, { teacherId: c.Value });
          break;

        default:
          break;
      }
    }

    return qB.getCount();
  }
}