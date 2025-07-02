import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    const rawToken =
      client.handshake.auth?.token ||
      (client.handshake.headers['authorization'] as string);

    if (!rawToken) throw new WsException('Unauthorized');

    try {
      const token = rawToken.split(' ')[1];
      const payload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_KEY_SECRET,
      });
      client.data.user = payload;
      return true;
    } catch {
      throw new WsException('Unauthorized');
    }
  }
}
