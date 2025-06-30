import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateLikeDto } from "./dto/create-like.dto";

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLikeDto: CreateLikeDto, userId:any) {
    try {
      let exsitingLike = await this.prisma.likes.findFirst({ where: { templateId: createLikeDto.templateId, userId } })
      if (!exsitingLike) {
        let likes = await this.prisma.likes.create({
          data: { templateId: createLikeDto.templateId, userId }
        })
        return { likes, message: 'Liked👍🏻' }
      } else {
        await this.prisma.likes.delete({ where: { id: exsitingLike.id } })
        return { message: 'Unliked👎🏻' }
      }
    } catch (error) {
      return new BadRequestException(error)
    }
  }

  async findAll() {
    try {
      let likes = await this.prisma.likes.findMany()
      if (!likes.length) return new HttpException("Not found!", HttpStatus.NOT_FOUND)
      return likes
    } catch (error) {
      return new BadRequestException(error)
    }
  }

}
