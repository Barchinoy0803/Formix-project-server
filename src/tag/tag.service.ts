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
      console.log(error);
    }
  }

  async findAll() {
    try {
      const tags = await this.prisma.tags.findMany()
      return tags
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    try {
      const tag = await this.prisma.tags.findUnique({ where: { id } })
      if (!tag) return new NotFoundException("Not found this tag")
      return tag
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  }

  async remove(tagIds: string[]) {
    try {
      if (!tagIds || tagIds.length === 0) {
        throw new BadRequestException('No tag IDs provided');
      }

      await this.prisma.tags.deleteMany({
        where: {
          id: { in: tagIds },
        },
      });

      return { message: 'Tags successfully deleted', deletedIds: tagIds };
    } catch (error) {
      console.error('Failed to delete tags:', error);
      throw new InternalServerErrorException('Failed to delete tags');
    }
  }

}
