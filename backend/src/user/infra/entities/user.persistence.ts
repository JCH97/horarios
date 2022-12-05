import { PersistentEntity } from '../../../shared/modules/data-access/typeorm/base.entity';
import { Column, Entity, Index, OneToOne } from 'typeorm';
import { UserStatus } from 'src/user/domain/enums/user.status';
import { TeacherPersistence } from '../../../teacher/infra/entities/teacher.persistence';

@Entity('user')
@Index(['id'], { unique: true })
export class UserPersistence extends PersistentEntity {
  @Column({ type: 'text' })
  username: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'float' })
  permissions: number;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.Register, // TODO; handle this later
  })
  status: UserStatus;

  @OneToOne(
    () => TeacherPersistence,
    teacher => teacher.user,
    { nullable: true, onDelete: 'SET NULL' },
  )
  teacher: TeacherPersistence;
}