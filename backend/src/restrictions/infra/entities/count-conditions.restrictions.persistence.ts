import { Column, Entity, Index } from 'typeorm';
import { BaseRestrictionPersistence } from './base-restriction.base-persistence';

@Entity('count_conditions_restrictions')
@Index(['id'], { unique: true })
export class CountConditionsRestrictionsPersistence extends BaseRestrictionPersistence {

  @Column({ type: 'int' })
  part: number;

  @Column({ type: 'text' })
  subConditions: string;

  @Column({ type: 'text' })
  operator: string;
}
