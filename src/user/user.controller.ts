import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { ROLE } from '@prisma/client';
import { SelfGuard } from 'src/guards/self.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch('update-status')
  async updateUserStatus(@Body('ids') ids: string | string[], @Body('role') role: ROLE) {
    const idArray = typeof ids === 'string' ? ids.split(',') : ids;
    return this.userService.updateUserRole(idArray, role);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Delete()
  remove(@Body('ids') ids: string | string[]) {
    const idArray = typeof ids === 'string' ? ids.split(',') : ids;
    return this.userService.remove(idArray);
  }
}
