import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enum/permissions.enum';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: Array<Permission>) => SetMetadata(PERMISSIONS_KEY, permissions);
