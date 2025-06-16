import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { totp } from 'otplib';

@Injectable()
export class MailService {
  constructor(
    private readonly mailServise: MailerService
  ) {
    totp.options = { step: 600, digits: 6 }
  }

  async sendOtp(email: string) {
    const secretKey = process.env.OTP_SECRET;
    if (!secretKey) {
      throw new InternalServerErrorException('OTP secret key is not configured.');
    }
    try {
      let otp = totp.generate(secretKey)
      await this.mailServise.sendMail({
        to: email,
        subject: "OTP verification",
        html: `<h1>Your otp is <strong>${otp}</strong></h1><p>This otp is valid for 10 minutes</p>`
      })
      return { message: "Otp send successfully✅" }
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw new InternalServerErrorException('Failed to send OTP email.'); 
    }
  }

  async verifyOtp(otp: string): Promise<{ message: string }> {
    const secretKey = process.env.OTP_SECRET;
    if (!secretKey) {
      throw new InternalServerErrorException('OTP secret key is not configured.');
    }
    const isValid = totp.check(otp, secretKey);

    if (!isValid) {
      throw new BadRequestException("Invalid otp");
    }

    return { message: "Your otp is successfully verified✅" };
  }
}
