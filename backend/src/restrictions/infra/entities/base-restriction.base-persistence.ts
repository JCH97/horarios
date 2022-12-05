import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { Column } from 'typeorm';
import { RestrictionType } from '../../domain/enums/restriction-type';

export abstract class BaseRestrictionPersistence extends PersistentEntity {
  @Column({ type: 'text' })
  conditions: string;

  @Column({ type: 'int' })
  interval: number;

  @Column({ type: 'int' })
  priority: number;

  @Column({ type: 'text', name: 'teacher_id' })
  teacherId: string;

  @Column({ type: 'enum', enum: RestrictionType, default: RestrictionType.Unknown })
  restrictionType: RestrictionType;

  @Column({ type: 'text' })
  description: string;
}