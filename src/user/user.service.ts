import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ROLE, USER_STATUS } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    try {
      let users = await this.prisma.user.findMany()
      return users
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    try {
      let user = await this.prisma.user.findUnique({ where: { id } })
      if (!user) throw new NotFoundException("Not found this user!")
      return user
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      let updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto
      })
      return updatedUser
    } catch (error) {
      console.log(error);
    }
  }

  async remove(ids: string[]) {
    try {
      console.log(1);
      
      if (!ids || ids.length === 0) {
        throw new Error('No user IDs provided');
      }

      const existingUsers = await this.prisma.user.findMany({
        where: { id: { in: ids } }
      });

      if (existingUsers.length === 0) {
        throw new NotFoundException('No matching users found to delete');
      }

      const deleted = await this.prisma.user.deleteMany({
        where: { id: { in: ids } }
      });

      return { message: `${deleted.count} user(s) successfully deleted!` };
    } catch (error) {
      console.log(error);
    }
  }

  async updateUserRole(ids: string[], role: ROLE) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('User ID list is required');
      }

      let updated = await this.prisma.user.updateMany({
        where: {
          id: {
            in: ids
          },
        },
        data: {
          role
        }
      })

      return {
        message: `${updated.count} users updated successfully`
      }
    } catch (error) {
      console.log(error);
    }
  }
}
