import { UserStatus } from 'src/user/domain/enums/user.status';

export type UserCreateDto = {
  username: string;
  permissions: number;
  password: string
  email: string
  status: UserStatus
}