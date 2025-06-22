import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ROLE } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SelfGuard implements CanActivate {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();

        const userIds = req.body.ids;
        const ownerId = req['user'].id;

        if (!userIds || !ownerId) return false;
        console.log(userIds, ownerId);
        

        const idArray = typeof userIds === 'string' ? userIds.split(',') : userIds;

        const isSelf = idArray.every((id: string) => id === ownerId);
        if (isSelf) return true;

        return req['user'].role === ROLE.ADMIN;
    }
}
