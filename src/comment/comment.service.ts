import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment } from "@prisma/client";

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    try {
      return await this.prisma.comment.create({
        data: {
          ...createCommentDto,
          userId,
        },
      });
    } catch (error) {
      console.error("Create comment error:", error);
      throw new InternalServerErrorException("Failed to create comment");
    }
  }

  async findAll(): Promise<Comment[]> {
    try {
      return await this.prisma.comment.findMany();
    } catch (error) {
      console.error("Find all comments error:", error);
      throw new InternalServerErrorException("Failed to fetch comments");
    }
  }

  async findOne(id: string): Promise<Comment> {
    try {
      const comment = await this.prisma.comment.findUnique({ where: { id } });
      if (!comment) throw new NotFoundException("Comment not found");
      return comment;
    } catch (error) {
      console.error("Find comment error:", error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException("Failed to fetch comment");
    }
  }

  async updateComment(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    try {
      return await this.prisma.comment.update({
        where: { id },
        data: updateCommentDto,
      });
    } catch (error) {
      console.error("Update comment error:", error);
      throw new InternalServerErrorException("Failed to update comment");
    }
  }

  async deleteComment(id: string): Promise<Comment> {
    try {
      return await this.prisma.comment.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Delete comment error:", error);
      throw new InternalServerErrorException("Failed to delete comment");
    }
  }
}
