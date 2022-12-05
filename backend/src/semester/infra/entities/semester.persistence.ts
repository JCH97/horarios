import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { Column, Entity, Index, ManyToMany, OneToMany } from 'typeorm';
import { LessonPersistence } from '../../../lesson/infra/entities/lesson.persistence';
import { WeekPersistence } from '../../../week/infra/entities/week.persistence';

@Entity('semester')
@Index(['id'], { unique: true })
export class SemesterPersistence extends PersistentEntity {
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
  start: Date;

  @Column({ type: 'timestamp' })
  end: Date;

  @ManyToMany(
    () => LessonPersistence,
    lesson => lesson.semesters,
    {},
  )
  lessons: LessonPersistence[];

  @OneToMany(
    () => WeekPersistence,
    w => w.semester,
    {})
  weeks: WeekPersistence[] | any;
}
