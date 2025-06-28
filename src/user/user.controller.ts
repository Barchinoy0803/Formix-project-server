import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorators';
import { ROLE, USER_STATUS } from '@prisma/client';
import { SelfGuard } from '../guards/self.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthGuard)
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
  @Patch('update-role')
  async updateUserStatusRole(@Body() body: { ids: string | string[], role: ROLE }) {
    const idArray = typeof body.ids === 'string' ? body.ids.split(',') : body.ids;
    return this.userService.updateUserRole(idArray, body.role);
  }

  @Roles(ROLE.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch('update-status')
  async updateUserStatusStatus(@Body() body: { ids: string | string[], status: USER_STATUS }) {
    const idArray = typeof body.ids === 'string' ? body.ids.split(',') : body.ids;
    return this.userService.updateUserStatus(idArray, body.status);
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
