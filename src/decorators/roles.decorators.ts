import { SetMetadata } from "@nestjs/common";

export const ROLE_TYPES = 'roles'
export const Roles = (...roles: string[]) => SetMetadata(ROLE_TYPES, roles)
