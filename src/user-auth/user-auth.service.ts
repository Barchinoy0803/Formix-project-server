import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserAuthDto } from './dto/login-user-auth.dto';
import * as bcrypt from "bcrypt"
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { USER_STATUS } from '@prisma/client';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService
  ) { }

  async findUser(email: string) {
    try {
      let user = await this.prisma.user.findUnique({ where: { email } })
      if (!user) throw new NotFoundException("not found this user")
      return user
    } catch (error) {
      console.log(error);
    }
  }

  async register(createUserAuthDto: CreateUserAuthDto) {
    try {
      let { email, password } = createUserAuthDto
      let user = await this.findUser(email)
      if (user) return new BadRequestException("Already registered!")
      let hashedPassword = bcrypt.hashSync(password, 10)
      await this.prisma.user.create({ data: { ...createUserAuthDto, password: hashedPassword } })
      this.mailService.sendOtp(email)
      return { message: "Successfully registered" }
    } catch (error) {
      console.log(error);
    }
  }

  async activate(email: string, otp: string) {
    try {
      let user = await this.findUser(email)
      if (!user) throw new UnauthorizedException("Not found this user!")
      if (user.status === USER_STATUS.ACTIVE) throw new HttpException("Already activated!", HttpStatus.ALREADY_REPORTED)
      this.mailService.verifyOtp(otp)
      await this.prisma.user.update({
        where: { email },
        data: { status: USER_STATUS.ACTIVE }
      })
      return { message: "Successfully activated!" }
    } catch (error) {
      console.log(error);
    }
  }

  async login(loginUserAuthDto: LoginUserAuthDto) {
    try {
      let { email, password } = loginUserAuthDto
      let user = await this.findUser(email)
      if (!user) return new NotFoundException("Not found this user, please register")
      if (user.status === USER_STATUS.INACTIVE) return new BadRequestException("Your account is not activated, please activate!")
      let isCorrectPassword = bcrypt.compareSync(password, user.password)
      if (!isCorrectPassword) throw new BadRequestException("Wrong credentials!");
      const accessToken = await this.generateAccessToken({ id: user.id, role: user.role })

      return { token: accessToken }
    } catch (error) {
      console.log(error);
    }
  }

  async generateAccessToken(payload: { id: string, role: string }) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_KEY_SECRET,
      expiresIn: '7d'
    });
    return token;
  }
}
