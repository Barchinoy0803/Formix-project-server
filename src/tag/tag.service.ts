import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createTagDto: CreateTagDto) {
    try {
      const tag = await this.prisma.tags.create({ data: createTagDto })
      return tag
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const tags = await this.prisma.tags.findMany()
      return tags
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const tag = await this.prisma.tags.findUnique({
        where: { id },
        include: { templates: true }
      })
      if (!tag) return new NotFoundException("Not found this tag")
      return tag
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    try {
      const updatedTag = await this.prisma.tags.update({
        where: { id },
        data: updateTagDto
      })
      return updatedTag
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.tags.delete({
        where: { id },
      });

      return { message: 'Successfully deleted', deletedId: id };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
