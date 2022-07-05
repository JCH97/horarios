import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from 'typeorm';
import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { FacultyPersistence } from '../../../faculty/infra/entities/faculty.persistence';
import { LessonPersistence } from '../../../lesson/infra/entities/lesson.persistence';
import { DepartmentPersistence } from '../../../department/infra/entities/department.persistence';
import { TeacherPersistence } from '../../../teacher/infra/entities/teacher.persistence';
import { LocalPersistence } from '../../../local/infra/entities/local.persistence';
import { TypeclassPersistence } from '../../../typeclass/infra/entities/typeclass.persistence';

@Entity('class')
@Index(['id'], { unique: true })
export class ClassPersistence extends PersistentEntity {
  @Column({ type: 'text' })
  shortName: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  priority: number;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text', name: 'local_id' })
  localId: string;

  @Column({ type: 'text', name: 'lesson_id' })
  lessonId: string;

  @Column({ type: 'text', name: 'type_class_id' })
  typeClassId: string;

  @Column({ type: 'date' })
  start: Date;

  @Column({ type: 'date' })
  end: Date;

  @ManyToMany(
    () => TeacherPersistence,
    teacher => teacher.classes,
    { cascade: ['update'], nullable: true },
  )
  @JoinTable()
  teachers: TeacherPersistence[] | any;

  @ManyToOne(
    () => LocalPersistence,
    local => local.classes,
    { nullable: true })
  @JoinColumn({ name: 'local_id' })
  local: LocalPersistence | any;

  @ManyToOne(
    () => LessonPersistence,
    lesson => lesson.classes,
    { nullable: true },
  )
  @JoinColumn({ name: 'lesson_id' })
  lesson: LessonPersistence | any;

  @ManyToOne(
    () => TypeclassPersistence,
    type => type.classes,
    { nullable: true },
  )
  @JoinColumn({ name: 'type_class_id' })
  typeClass: TypeclassPersistence | any;

}
