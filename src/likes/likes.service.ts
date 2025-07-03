import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateLikeDto } from "./dto/create-like.dto";

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createLikeDto: CreateLikeDto, context: { userId: string }) {
    try {
      const existingLike = await this.prisma.likes.findFirst({ 
        where: { 
          templateId: createLikeDto.templateId, 
          userId: context.userId 
        } 
      });
      
      if (!existingLike) {
        const likes = await this.prisma.likes.create({
          data: { 
            templateId: createLikeDto.templateId, 
            userId: context.userId 
          }
        });
        return { likes, message: 'Liked👍🏻' };
      } else {
        await this.prisma.likes.delete({ where: { id: existingLike.id } });
        return { message: 'Unliked👎🏻' };
      }
    } catch (error) {
      console.error('Error in like service:', error);
      throw new BadRequestException('Failed to toggle like');
    }
  }

  async findAllTemplateLikes(templateId: string) {
    try {
      const likes = await this.prisma.likes.findMany({ 
        where: { templateId },
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        }
      });
      
      return { likes, count: likes.length };
    } catch (error) {
      console.error('Error fetching likes:', error);
      throw new BadRequestException('Failed to fetch likes');
    }
  }
}