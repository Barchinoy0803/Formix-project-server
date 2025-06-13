import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { CreateUserAuthDto } from './dto/create-user-auth.dto';
import { UpdateUserAuthDto } from './dto/update-user-auth.dto';
import { LoginUserAuthDto } from './dto/login-user-auth.dto';

@Controller('user-auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) { }

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
