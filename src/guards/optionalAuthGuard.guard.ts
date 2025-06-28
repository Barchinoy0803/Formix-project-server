import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            return true;
        }

        try {
            const data = this.jwtService.verify(token, {
                secret: process.env.ACCESS_KEY_SECRET,
            });

            request['user'] = data;

            const user = await this.prisma.user.findUnique({ where: { id: data.id } });

            if (!user) return true; 

            request['user'] = user;
        } catch (err) {
            return true;
        }

        return true;
    }
}
