import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { FacultyPersistence } from '../../../faculty/infra/entities/faculty.persistence';
import { MajorPersistence } from '../../../major/infra/entities/major.persistence';

@Entity('student')
@Index(['id'], { unique: true })
export class StudentPersistence extends PersistentEntity {
  @Column({ type: 'text' })
  shortName: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'text', name: 'faculty_id' })
  facultyId?: string | any;

  @ManyToOne(
    () => FacultyPersistence,
    faculty => faculty.students,
    { nullable: true })
  @JoinColumn({ name: 'faculty_id' })
  faculty?: FacultyPersistence;

  @Column({ type: 'text', name: 'major_id' })
  majorId?: string | any;

  @ManyToOne(
    () => MajorPersistence,
    major => major.students,
    { nullable: true })
  @JoinColumn({ name: 'major_id' })
  major?: MajorPersistence;

}
