import { UserStatus } from 'src/user/domain/enums/user.status';

export type UserUpdateDto = {
  id: string
  data: {
    username?: string;
    permissions?: number;
    password?: string;
    status?: UserStatus;
    email?: string;
  }
}