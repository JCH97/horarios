import { Column, Entity, Index, OneToMany } from 'typeorm';
import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { EnumActivitieType } from '../../domain/enums/enum.activitie.type';
import { ClassPersistence } from '../../../class/infra/entities/class.persistence';

@Entity('typeclass')
@Index(['id'], { unique: true })
export class TypeclassPersistence extends PersistentEntity {
  @Column({ type: 'text' })
  shortName: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'enum', enum: EnumActivitieType, default: EnumActivitieType.CP })
  type: EnumActivitieType;

  @Column({ type: 'int' })
  duration: number;

  @OneToMany(
    () => ClassPersistence,
    c => c.typeClass,
    {},
  )
  classes: ClassPersistence[];
}
