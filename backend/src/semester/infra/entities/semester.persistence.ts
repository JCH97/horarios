import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { Column, Entity, Index, ManyToMany, OneToMany } from 'typeorm';
import { FacultyPersistence } from '../../../faculty/infra/entities/faculty.persistence';
import { LessonPersistence } from '../../../lesson/infra/entities/lesson.persistence';

@Entity('semester')
@Index(['id'], { unique: true })
export class SemesterPersistence extends PersistentEntity {
  @Column({ type: 'text' })
  shortName: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  priority: number;

  @Column({ type: 'float' })
  duration: number;

  @Column({ type: 'date' })
  start: Date;

  @Column({ type: 'date' })
  end: Date;

  @ManyToMany(
    () => LessonPersistence,
    lesson => lesson.semesters,
    {},
  )
  lessons: LessonPersistence[];
}
