import { Column, Entity, Index } from 'typeorm';
import { BaseRestrictionPersistence } from './base-restriction.base-persistence';

@Entity('distribution_restrictions')
@Index(['id'], { unique: true })
export class DistributionRestrictionsPersistence extends BaseRestrictionPersistence {

  @Column({ type: 'int' })
  min: number;

  @Column({ type: 'text' })
  attribute: string;

  @Column({ type: 'text' })
  operator: string;
}
