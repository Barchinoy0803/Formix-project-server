import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_TYPES } from "../decorators/roles.decorators";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLE_TYPES,
            [
                context.getHandler(),
                context.getClass()
            ]
        )

        if (!requiredRoles) return true

        try {
            const { user } = context.switchToHttp().getRequest()
            return requiredRoles.some((role) => role === user.role)
        } catch (error) {
            throw new UnauthorizedException(error)
        }
    }
}
