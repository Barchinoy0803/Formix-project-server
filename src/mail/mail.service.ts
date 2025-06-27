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
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; 
              font-family: Arial, sans-serif; background-color: #f9f9f9; 
              border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="color: #333; text-align: center;">🔐 Your One-Time Password (OTP)</h2>
              <p style="font-size: 16px; color: #555; text-align: center;">
                Use the following OTP to complete your action:
              </p>
          <div style="text-align: center; margin: 20px 0;">
             <span style="display: inline-block; background-color: #eaf4ff; 
                   color: #007bff; font-size: 24px; font-weight: bold; 
                   padding: 12px 24px; border-radius: 6px; 
                   letter-spacing: 2px;">
                       ${otp}
              </span>
          </div>
                <p style="font-size: 14px; color: #888; text-align: center;">
                    This code is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
                </p>
          </div>
        `

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
