import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { MajorPersistence } from '../../../major/infra/entities/major.persistence';
import { ClassPersistence } from '../../../class/infra/entities/class.persistence';

@Entity('group')
@Index(['id'], { unique: true })
export class GroupPersistence extends PersistentEntity {
  @Column({ type: 'text' })
  shortName: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'text', name: 'major_id' })
  majorId: string;

  @Column({ type: 'text', default: '#0000FF' })
  color: string;

  @ManyToOne(
    () => MajorPersistence,
    major => major.groups,
    { nullable: true },
  )
  @JoinColumn({ name: 'major_id' })
  major: MajorPersistence | any;

  @OneToMany(
    () => ClassPersistence,
    c => c.group,
    {},
  )
  classes: ClassPersistence[];
}
