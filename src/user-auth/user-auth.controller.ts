import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { LoginUserAuthDto } from './dto/login-user-auth.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';

@Controller('user-auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) { }

  @Get('token')
  @UseGuards(AuthGuard)
  async getApiToken(@Req() req) {
    return this.userAuthService.getToken(req)
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Req() req) {
    return this.userAuthService.me(req)
  }

  @Post('register')
  register(@Body() createUserAuthDto: CreateUserAuthDto) {
    return this.userAuthService.register(createUserAuthDto);
  }

  @Post('login')
  login(@Body() loginUserAuthDto: LoginUserAuthDto) {
    return this.userAuthService.login(loginUserAuthDto);
  }

  @Post('activate')
  activate(@Body() body: { email: string; otp: string }) {
    return this.userAuthService.activate(body.email, body.otp);
  }

}
