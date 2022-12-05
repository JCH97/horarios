import { Column, Entity, Index } from 'typeorm';
import { BaseRestrictionPersistence } from './base-restriction.base-persistence';

@Entity('relational_restrictions')
@Index(['id'], { unique: true })
export class RelationalRestrictionsPersistence extends BaseRestrictionPersistence {

  @Column({ type: 'text' })
  attribute: string;

  @Column({ type: 'text' })
  subConditions: string;

  @Column({ type: 'text' })
  operator: string;
}
