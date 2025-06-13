import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @Post('send-otp')
  sendOtp(@Body('email') email: string) {
    return this.mailService.sendOtp(email);
  }

  @Post()
  verifyOtp(@Body('otp') otp: string) {
    return this.mailService.verifyOtp(otp);
  }
}
