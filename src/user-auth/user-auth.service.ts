import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserAuthDto } from './dto/login-user-auth.dto';
import * as bcrypt from "bcrypt"
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { User, USER_STATUS } from '@prisma/client';
import { randomBytes } from 'crypto';

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
      return user
    } catch (error) {
      throw error;
    }
  }
   
  async register(createUserAuthDto: CreateUserAuthDto): Promise<Omit<User, 'password' | 'role' | 'status'>> {
    try {
      const { email, password, ...rest } = createUserAuthDto;

      const existingUser = await this.prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        throw new BadRequestException('Already registered!');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const token = randomBytes(32).toString('hex')

      const newUser = await this.prisma.user.create({
        data: {
          ...rest,
          email,
          password: hashedPassword,
          apiToken: token
        },
      });

      await this.mailService.sendOtp(email);

      const { password: _, role: __, status: ___, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getToken(req: Request) {
    try {
      const id = req['user'].id
      const user = await this.prisma.user.findUnique({ where: { id }, select: { apiToken: true } })

      if (!user || !user.apiToken) {
        throw new NotFoundException('API token not found');
      }

      return { token: user.apiToken }
    } catch (error) {
      console.error('Error getting API token:', error);
      throw new InternalServerErrorException('Error getting API token');
    }
  }

  async me(req: Request) {
    try {
      const id = req['user'].id;
      const user = await this.prisma.user.findUnique({ where: { id }})

      if (!user) {
        throw new NotFoundException('User token not found');
      }

      const { password: _, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      console.error('Error getting me:', error);
      throw new InternalServerErrorException('Error getting API token');
    }
  }

  async activate(email: string, otp: string) {
    try {
      const user = await this.findUser(email);

      if (!user) throw new UnauthorizedException("Not found this user!");

      if (user.status === USER_STATUS.ACTIVE) {
        throw new HttpException("Already activated!", HttpStatus.ALREADY_REPORTED);
      }

      await this.mailService.verifyOtp(otp);

      await this.prisma.user.update({
        where: { email },
        data: { status: USER_STATUS.ACTIVE },
      });

      return { message: "Successfully activated!", activated: true };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error("Activation error:", error);
      throw new InternalServerErrorException("Activation failed");
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

      return { token: accessToken, role: user.role }
    } catch (error) {
      throw error;
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
