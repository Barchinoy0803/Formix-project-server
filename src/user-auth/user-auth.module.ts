import { Module } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { MailService } from '../mail/mail.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ global: true })],
  controllers: [UserAuthController],
  providers: [UserAuthService, MailService],
})
export class UserAuthModule { }
