import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from "@nestjs/core";
import { PrismaService } from '../prisma/prisma.service';
import { ROLE } from '@prisma/client';

@Injectable()
export class OwnerGuard implements CanActivate {
    constructor(
        private readonly prisma: PrismaService,
        private readonly reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) return false;

        const entity = this.reflector.get<string>('entity', context.getHandler());
        if (!entity) throw new ForbiddenException('No entity provided for ownership check');

        const ids: string[] = Array.isArray(request.body?.ids)
            ? request.body.ids
            : request.body?.ids?.split?.(',') ||
            (request.params?.id ? [request.params.id] : []);

        if (!ids.length) return false;

        if (user.role === ROLE.ADMIN) return true;

        const records = await (this.prisma as any)[entity].findMany({
            where: { id: { in: ids } },
            select: { userId: true },
        });

        if (!records.length) return false;

        return records.every(record => record.userId === user.id);
    }
}
