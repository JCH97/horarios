import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { TeacherPersistence } from '../../../teacher/infra/entities/teacher.persistence';
import { LocalPersistence } from '../../../local/infra/entities/local.persistence';
import { MajorPersistence } from '../../../major/infra/entities/major.persistence';
import { ClassPersistence } from '../../../class/infra/entities/class.persistence';
import { SemesterPersistence } from '../../../semester/infra/entities/semester.persistence';

@Entity('lesson')
@Index(['id'], { unique: true })
export class LessonPersistence extends PersistentEntity {
  @Column({ type: 'text' })
  shortName: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 1 })
  priority: number;

  // @Column({ type: 'int' })
  // duration: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'text', name: 'teacher_id', nullable: true })
  teacherId?: string;

  @Column({ type: 'text', name: 'local_id', nullable: true })
  localId: string;

  @Column({ type: 'text', name: 'major_id' })
  majorId: string;

  @ManyToOne(
    () => TeacherPersistence,
    teacher => teacher.lesson,
    {})
  @JoinColumn({ name: 'teacher_id' })
  teacher?: TeacherPersistence | any;

  @ManyToOne(
    () => LocalPersistence,
    local => local.lesson,
    { nullable: true })
  @JoinColumn({ name: 'local_id' })
  local: LocalPersistence | any;

  @ManyToOne(
    () => MajorPersistence,
    major => major.lesson,
    {})
  @JoinColumn({ name: 'major_id' })
  major: MajorPersistence | any;

  @OneToMany(
    () => ClassPersistence,
    c => c.lesson,
    {},
  )
  classes: ClassPersistence[];

  @ManyToMany(
    () => SemesterPersistence,
    semester => semester.lessons,
    {},
  )
  @JoinTable()
  semesters: SemesterPersistence[] | any[];
}