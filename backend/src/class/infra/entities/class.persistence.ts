import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { LessonPersistence } from '../../../lesson/infra/entities/lesson.persistence';
import { TeacherPersistence } from '../../../teacher/infra/entities/teacher.persistence';
import { LocalPersistence } from '../../../local/infra/entities/local.persistence';
import { TypeclassPersistence } from '../../../typeclass/infra/entities/typeclass.persistence';
import { GroupPersistence } from '../../../group/infra/entities/group.persistence';
import { WeekPersistence } from '../../../week/infra/entities/week.persistence';

@Entity('class')
@Index(['id'], { unique: true })
export class ClassPersistence extends PersistentEntity {

  @BeforeInsert()
  @BeforeUpdate()
  extractDayOfWeek() {
    this.dayOfWeek = new Date(this.start).getDay();
  }

  @Column({ type: 'text' })
  shortName: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'int', default: 0 })
  dayOfWeek: number;

  @Column({ type: 'text', name: 'local_id' })
  localId: string;

  @Column({ type: 'text', name: 'lesson_id' })
  lessonId: string;

  @Column({ type: 'text', name: 'type_class_id' })
  typeClassId: string;

  @Column({ type: 'text', name: 'group_id' })
  groupId: string;

  @Column({ type: 'timestamp' })
  start: Date;

  @Column({ type: 'text', nullable: true })
  resourceId: string;

  @Column({ type: 'timestamp' })
  end: Date;

  @Column({ type: 'text' })
  serieId: string;

  @Column({ type: 'text', default: '#FF0000' })
  color: string;

  @Column({ type: 'text', name: 'week_id', nullable: true })
  weekId: string;

  @ManyToOne(
    () => WeekPersistence,
    w => w.classes,
    { onDelete: 'SET NULL', nullable: true },
  )
  @JoinColumn({ name: 'week_id' })
  week: WeekPersistence | any;

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

  @ManyToOne(
    () => GroupPersistence,
    group => group.classes,
    { nullable: true },
  )
  @JoinColumn({ name: 'group_id' })
  group: GroupPersistence | any;

}
