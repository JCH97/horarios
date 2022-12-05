import { SetMetadata } from '@nestjs/common';

export const PermissionsDecorator = (...permissions: number[]) => SetMetadata('permissions', permissions);