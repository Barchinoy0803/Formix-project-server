import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ROLE, USER_STATUS } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request: Request = context.switchToHttp().getRequest()
    let token = request.headers.authorization?.split(" ")[1]

    if (!token) {
      throw new UnauthorizedException("Not found token")
    }

    try {
      let data = this.jwtService.verify(token, { secret: process.env.ACCESS_KEY_SECRET })
      request['user'] = data

      const user = await this.prisma.user.findUnique({ where: { id: data.id } })

      if(user?.status === USER_STATUS.BLOCKED || user?.role === ROLE.USER){
        throw new ForbiddenException('User is blocked');
      }

      return true
    } catch (error) {
      console.log(error);
      
      throw new UnauthorizedException("not found token")
    }
  }
}
