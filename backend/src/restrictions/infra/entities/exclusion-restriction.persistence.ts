import { Column, Entity, Index } from 'typeorm';
import { BaseRestrictionPersistence } from './base-restriction.base-persistence';

@Entity('exclusion_restrictions')
@Index(['id'], { unique: true })
export class ExclusionRestrictionsPersistence extends BaseRestrictionPersistence {

  @Column({ type: 'simple-array' })
  attributes: string[];
}
