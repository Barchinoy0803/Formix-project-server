import { Injectable } from '@nestjs/common';
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
    const secretKey = process.env.OTP_SECRET
    try {
      let otp
      if (secretKey) {
        otp = totp.generate(secretKey)
      }
      await this.mailServise.sendMail({
        to: email,
        subject: "OTP verification",
        html: `<h1>Your otp is <strong>${otp}</strong></h1><p>This otp is valid for 10 minutes</p>`
      })
      return { message: "Otp send successfully✅" }
    } catch (error) {
      console.log(error);
    }
  }

  async verifyOtp(otp: string) {
    try {
      const secretKey = process.env.OTP_SECRET
      const isValid = totp.check(otp, secretKey!)
      if (!isValid) {
        return { message: "Invalid otp" }
      }
      return { message: "Your otp is successfully verified✅" }
    } catch (error) {
      console.log(error);
    }
  }
}
