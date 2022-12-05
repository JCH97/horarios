import { DomainEntity } from '../../../shared/domain/entity.abstract';
import { Result } from '../../../shared/core/Result';
import { Guard } from 'src/shared/core/Guard';
import { AppError } from 'src/shared/core/errors/AppError';
import { UserStatus } from '../enums/user.status';
import { hashSync } from 'bcrypt';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';

type UserProps = {
  username: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  password: string;
  status: UserStatus;
  permissions: number;
  teacherId?: { id: string; }
};


type newUserProps = Omit<UserProps,
  'id' | 'createdAt' | 'updatedAt'>;


type updateUserProps = {
  username?: string;
  password?: string;
  status?: UserStatus;
  permissions?: number;
  email?: string;
};


export class User extends DomainEntity<UserProps> {

  get username(): string {
    return this.props.username;
  }

  get teacherId(): { id: string } {
    return this.props.teacherId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get permissions(): number {
    return this.props.permissions;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  public SetNewPermission(permission): void {
    let permissions = (this.permissions ?? 0) | permission;

    this.props.permissions = permissions;
  }

  public RemovePermission(permission): void {
    const pos = Math.log2(permission & -permission) + 1;
    this.props.permissions = this.permissions & ~(1 << (pos - 1));
  }

  public static CheckPermission(permission: number, allPermissions: number): boolean {
    return (allPermissions & permission) > 0;
  }


  public static New(props: newUserProps): Result<User> {
    const ans: Result<User> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: UserProps, id: string = null): Result<User> {
    const shortNameOrError = Guard.againstAtLeast({
      argumentPath: 'username',
      numChars: 3,
      argument: props.username,
    });
    if (!shortNameOrError.succeeded) {
      return Result.Fail(new AppError.ValidationError(shortNameOrError.message));
    }


    const passwordOrError = Guard.againstAtLeast({ argumentPath: 'password', numChars: 3, argument: props.password });
    if (!passwordOrError.succeeded) {
      return Result.Fail(new AppError.ValidationError(passwordOrError.message));
    }

    return Result.Ok(new User(props, new UniqueEntityID(id)));
  }

  public setPasswordHash(password: string) {
    if (password) {
      this.props.password = hashSync(password, 5);
    }
  }

  public Update(props: updateUserProps) {
    if (props.username) {
      const shortNameOrError = Guard.againstAtLeast({
        argumentPath: 'shortname',
        numChars: 3,
        argument: props.username,
      });
      if (!shortNameOrError.succeeded) {
        return Result.Fail(new AppError.ValidationError(shortNameOrError.message));
      }
      this.props.username = props.username;
    }

    if (props.password) {
      const passwordOrError = Guard.againstAtLeast({
        argumentPath: 'password',
        numChars: 3,
        argument: props.password,
      });
      if (!passwordOrError.succeeded) {
        return Result.Fail(new AppError.ValidationError(passwordOrError.message));
      }
    }

    if (props.permissions)
      this.props.permissions = props.permissions;

    this.props.status = props.status ?? this.props.status;
    this.props.email = props.email ?? this.props.email;


    return Result.Ok(this);
  }
}
