import { IRepository, IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { EntityManager } from 'typeorm';
import { ClassRepository } from './class.repository';
import { Class } from '../../domain/entities/class.entity';
import { ClassPersistence } from '../entities/class.persistence';
import { OrmName } from '../../../shared/modules/data-access/types/orm-name.enum';

export class ClassRepositoryFact
  implements IRepositoryFactory<Class, IRepository<Class>> {
  getOrmName(): string {
    return OrmName.TYPE_ORM;
  }

  build(txManager: EntityManager): IRepository<Class> {
    return new ClassRepository(txManager.getRepository(ClassPersistence));
  }
}
