import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class TemplateService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(createTemplateDto: CreateTemplateDto, req: Request) {
    try {
      const userId = req['user'].id
      let template = await this.prisma.template.create({ data: { ...createTemplateDto, userId } })
      return template
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    try {
      let templates = await this.prisma.template.findMany()
      return templates
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    try {
      let template = await this.prisma.template.findUnique({ where: { id } })
      if (!template) {
        throw new NotFoundException("Not found")
      }
      return template
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto) {
    try {
      let updated = await this.prisma.template.update({
        where: { id },
        data: updateTemplateDto
      })
      return updated
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.template.delete({ where: { id } })
      return new HttpException("Deleted successfully", HttpStatus.ACCEPTED)
    } catch (error) {
      console.log(error);
    }
  }
}
