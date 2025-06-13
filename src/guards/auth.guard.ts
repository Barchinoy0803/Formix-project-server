import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService
  ) { }

  canActivate(context: ExecutionContext): boolean {
    let request: Request = context.switchToHttp().getRequest()
    let token = request.headers.authorization?.split(" ")[1]

    if (!token) {
      throw new UnauthorizedException("Not found token")
    }

    try {
      let data = this.jwtService.verify(token, { secret: process.env.ACCESS_KEY_SECRET })
      request['user'] = data

      return true
    } catch (error) {
      throw new UnauthorizedException("not found token")
    }
  }
}
