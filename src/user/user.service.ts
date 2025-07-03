import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ROLE, USER_STATUS } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    try {
      let users = await this.prisma.user.findMany()
      return users
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      let user = await this.prisma.user.findUnique({ where: { id } })
      if (!user) throw new NotFoundException("Not found this user!")
      return user
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  async remove(ids: string[]) {
    try {
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

      if (deleted.count > 0) {
        return { message: `${deleted.count} user(s) successfully deleted!` };
      }
    } catch (error) {
      throw error;
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

      if (updated.count > 0) {
        return {
          message: `${updated.count} users updated successfully`
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async updateUserStatus(ids: string[], status: USER_STATUS) {
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
          status
        }
      })

      if (updated.count > 0) {
        return {
          message: `${updated.count} users updated successfully`
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
