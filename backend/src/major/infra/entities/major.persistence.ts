import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { FacultyPersistence } from '../../../faculty/infra/entities/faculty.persistence';
import { StudentPersistence } from '../../../student/infra/entities/student.persistence';
import { LessonPersistence } from '../../../lesson/infra/entities/lesson.persistence';
import { GroupPersistence } from '../../../group/infra/entities/group.persistence';

@Entity('major')
@Index(['id'], { unique: true })
export class MajorPersistence extends PersistentEntity {
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

  @Column({ type: 'text', name: 'faculty_id' })
  facultyId: string;

  @ManyToOne(
    () => FacultyPersistence,
    faculty => faculty.majors, {},
  )
  @JoinColumn({ name: 'faculty_id' })
  faculty: FacultyPersistence;

  @OneToMany(
    () => StudentPersistence,
    student => student.major)
  students: StudentPersistence[];

  @OneToMany(
    () => LessonPersistence,
    lesson => lesson.major,
    { nullable: true },
  )
  lesson: LessonPersistence[];

  @OneToMany(
    () => GroupPersistence,
    group => group.major,
    {},
  )
  groups: GroupPersistence[] | any;
}
