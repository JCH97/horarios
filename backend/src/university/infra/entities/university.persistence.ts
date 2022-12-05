import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { FacultyPersistence } from '../../../faculty/infra/entities/faculty.persistence';

@Entity('university')
@Index(['id'], { unique: true })
export class UniversityPersistence extends PersistentEntity {
  @Column({ type: 'text' })
  shortName: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @OneToMany(
    () => FacultyPersistence,
    f => f.university,
    {},
  )
  faculties: FacultyPersistence[];
}
