import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(dto: CreateCommentDto, userId: string): Promise<Comment> {
    try {
      console.log(dto, userId)
      return await this.prisma.comment.create({
        data: {
          context: dto.context,
          user:     { connect: { id: userId } },
          template: { connect: { id: dto.templateId } },
        },
        include: { user: true },
      });
    } catch (err) {
      console.log(err)
      throw new InternalServerErrorException('Failed to create comment');
    }
  }

  async findAllByTemplate(templateId: string): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: { templateId },
      include: { user: true },
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async updateComment(id: string, dto: UpdateCommentDto): Promise<Comment> {
    return this.prisma.comment.update({
      where: { id },
      data:  dto,
      include: { user: true },
    });
  }

  async deleteComment(id: string): Promise<Comment> {
    return this.prisma.comment.delete({ where: { id } });
  }
}
