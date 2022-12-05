import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ValidatePermissions } from '../../../shared/core/validate-permissions';

const matchPermissions = (permission: number[], permissions: number) => {
  return permission.some(p => ValidatePermissions.Validate(p, permissions));
};


@Injectable()
export class PermissionsGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const permissions = this.reflector.get<number[]>('permissions', context.getHandler());

    if (!permissions) {
      return true;
    }
    const req = context.switchToHttp().getRequest();

    const user = req.user;
    return matchPermissions(permissions, user.permissions);
  }
}