import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(dto: CreateCommentDto, userId: string): Promise<Comment> {
    try {
      return await this.prisma.comment.create({ data: { ...dto, userId } });
    } catch (e) {
      throw new InternalServerErrorException('Failed to create comment');
    }
  }

  async findAll(templateId: string): Promise<Comment[]> {
    try {
      return await this.prisma.comment.findMany({
        where: { templateId },
      });
    } catch (e) {
      throw new InternalServerErrorException('Failed to fetch comments');
    }
  }

  async findOne(id: string): Promise<Comment> {
    try {
      const comment = await this.prisma.comment.findUnique({ where: { id } });
      if (!comment) throw new NotFoundException('Comment not found');
      return comment;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Failed to fetch comment');
    }
  }

  async updateComment(id: string, dto: UpdateCommentDto): Promise<Comment> {
    try {
      return await this.prisma.comment.update({ where: { id }, data: dto });
    } catch {
      throw new InternalServerErrorException('Failed to update comment');
    }
  }

  async deleteComment(id: string): Promise<Comment> {
    try {
      return await this.prisma.comment.delete({ where: { id } });
    } catch {
      throw new InternalServerErrorException('Failed to delete comment');
    }
  }
}
