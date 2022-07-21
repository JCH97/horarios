import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { FacultyPersistence } from '../../../faculty/infra/entities/faculty.persistence';
import { TeacherPersistence } from '../../../teacher/infra/entities/teacher.persistence';
import { LocalPersistence } from '../../../local/infra/entities/local.persistence';
import { MajorPersistence } from '../../../major/infra/entities/major.persistence';

@Entity('lesson')
@Index(['id'], { unique: true })
export class LessonPersistence extends PersistentEntity {
  @Column({ type: 'text' })
  shortName: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  priority: number;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'text', name: 'teacher_id' })
  teacherId: string;

  @Column({ type: 'text', name: 'local_id', nullable: true })
  localId: string;

  @Column({ type: 'text', name: 'major_id' })
  majorId: string;

  @OneToOne(
    () => TeacherPersistence,
    teacher => teacher.lesson,
    {})
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherPersistence | any;

  @OneToOne(
    () => LocalPersistence,
    local => local.lesson,
    { nullable: true })
  @JoinColumn({ name: 'local_id' })
  local: LocalPersistence | any;

  @OneToOne(
    () => MajorPersistence,
    major => major.lesson,
    {})
  @JoinColumn({ name: 'major_id' })
  major: MajorPersistence | any;
}