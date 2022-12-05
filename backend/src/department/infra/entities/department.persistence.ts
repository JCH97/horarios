import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { FacultyPersistence } from '../../../faculty/infra/entities/faculty.persistence';
import { LessonPersistence } from '../../../lesson/infra/entities/lesson.persistence';
import { TeacherPersistence } from '../../../teacher/infra/entities/teacher.persistence';

@Entity('department')
@Index(['id'], { unique: true })
export class DepartmentPersistence extends PersistentEntity {
  @Column({ type: 'text' })
  shortName: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @OneToMany(
    () => TeacherPersistence,
    teacher => teacher.department,
    {})
  teachers: TeacherPersistence[] | any;

  @Column({ type: 'text', name: 'faculty_id' })
  facultyId: string;

  @ManyToOne(
    () => FacultyPersistence,
    faculty => faculty.departments,
    {})
  @JoinColumn({ name: 'faculty_id' })
  faculty: FacultyPersistence | any;
}