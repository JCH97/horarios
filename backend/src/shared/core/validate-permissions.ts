export class ValidatePermissions {
  static Validate(permission: number, permissions: number): boolean {
    return (permission & permissions) === permission;
  }
}