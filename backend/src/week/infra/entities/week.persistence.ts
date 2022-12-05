import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SemesterPersistence } from '../../../semester/infra/entities/semester.persistence';
import { ClassPersistence } from '../../../class/infra/entities/class.persistence';

@Entity('week')
@Index(['id'], { unique: true })
export class WeekPersistence extends PersistentEntity {
  @Column({ type: 'text' })
  shortName: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'float' })
  duration: number;

  @Column({ type: 'timestamp' })
  firstDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'text', name: 'semester_id' })
  semesterId: string;

  @Column({ type: 'int' })
  number: number;

  @ManyToOne(
    () => SemesterPersistence,
    s => s.weeks,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'semester_id' })
  semester: SemesterPersistence | any;

  @OneToMany(
    () => ClassPersistence,
    c => c.week,
    {},
  )
  classes: ClassPersistence[];
}
