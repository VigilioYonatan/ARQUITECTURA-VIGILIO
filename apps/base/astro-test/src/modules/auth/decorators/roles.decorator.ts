import type { UserSchema } from "@modules/users";
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";
export const Roles = (...roles: UserSchema["role"][]) => SetMetadata(ROLES_KEY, roles);
