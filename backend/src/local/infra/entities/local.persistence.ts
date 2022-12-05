import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { FacultyPersistence } from '../../../faculty/infra/entities/faculty.persistence';
import { LessonPersistence } from '../../../lesson/infra/entities/lesson.persistence';
import { ClassPersistence } from '../../../class/infra/entities/class.persistence';

@Entity('local')
@Index(['id'], { unique: true })
export class LocalPersistence extends PersistentEntity {
  @Column({ type: 'text' })
  shortName: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'text', name: 'faculty_id' })
  facultyId: string;

  @Column({ type: 'int', default: 30 })
  capacity: number;

  @ManyToOne(
    () => FacultyPersistence,
    faculty => faculty.locals,
    {})
  @JoinColumn({ name: 'faculty_id' })
  faculty: FacultyPersistence;

  @OneToMany(
    () => LessonPersistence,
    lesson => lesson.local,
    { nullable: true })
  lesson: LessonPersistence[];

  @OneToMany(
    () => ClassPersistence,
    c => c.local,
    {},
  )
  classes: ClassPersistence[];
}
