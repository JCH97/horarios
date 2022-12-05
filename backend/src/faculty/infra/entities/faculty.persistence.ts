import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { UniversityPersistence } from '../../../university/infra/entities/university.persistence';
import { TeacherPersistence } from '../../../teacher/infra/entities/teacher.persistence';
import { MajorPersistence } from '../../../major/infra/entities/major.persistence';
import { LocalPersistence } from '../../../local/infra/entities/local.persistence';
import { StudentPersistence } from '../../../student/infra/entities/student.persistence';
import { DepartmentPersistence } from '../../../department/infra/entities/department.persistence';

@Entity('faculty')
@Index(['id'], { unique: true })
export class FacultyPersistence extends PersistentEntity {
  @Column({ type: 'text' })
  shortName: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'text', name: 'university_id' })
  universityId: string;

  @ManyToOne(
    () => UniversityPersistence,
    university => university.faculties,
    { cascade: ['remove', 'update'] },
  )
  @JoinColumn({ name: 'university_id' })
  university: UniversityPersistence;

  @ManyToMany(
    () => TeacherPersistence,
    teacher => teacher.faculties,
    { cascade: ['remove', 'update'] },
  )
  teachers: TeacherPersistence[];

  @OneToMany(() => MajorPersistence, major => major.faculty, { cascade: ['remove', 'update'] })
  majors: MajorPersistence[];

  @OneToMany(
    () => LocalPersistence,
    local => local.faculty,
    { cascade: ['update', 'remove'] })
  locals: LocalPersistence[];

  @OneToMany(
    () => StudentPersistence,
    student => student.faculty)
  students: StudentPersistence[];

  @OneToMany(
    () => DepartmentPersistence,
    department => department.faculty,
    { cascade: ['remove', 'update'] },
  )
  departments: DepartmentPersistence[];

}
