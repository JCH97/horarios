import { Column, Entity, Index } from 'typeorm';
import { BaseRestrictionPersistence } from './base-restriction.base-persistence';

@Entity('count_simple_restrictions')
@Index(['id'], { unique: true })
export class SimpleCountRestrictionsPersistence extends BaseRestrictionPersistence {

  @Column({ type: 'int', nullable: true })
  min?: number;

  @Column({ type: 'int', nullable: true })
  part?: number;

  @Column({ type: 'text' })
  operator: string;
}
