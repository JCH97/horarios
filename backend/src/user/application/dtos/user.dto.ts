import { BaseDto } from '../../../shared/core/BaseDto';
import { UserStatus } from '../../domain/enums/user.status';

export type UserDto = BaseDto & {
  username: string;
  permissions: number;
  email: string;
  status: UserStatus;
}