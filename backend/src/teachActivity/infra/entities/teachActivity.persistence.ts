import { Column, Entity, Index } from 'typeorm';
import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';

@Entity('teach_activity')
@Index(['id'], { unique: true })
export class TeachActivityPersistence extends PersistentEntity {
  @Column({ type: 'text' })
  shortName: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'int' })
  duration: number;
}
