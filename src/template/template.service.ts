import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { FORM_TYPE } from '@prisma/client';

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
      let templates = await this.prisma.template.findMany({
        where: { type: FORM_TYPE.PUBLIC }
      })
      return templates
    } catch (error) {
      console.log(error);
    }
  }

  async findAllUserTemplates(req: Request) {
    try {
      const userId = req['user'].id
      let templates = await this.prisma.template.findMany({
        where: { userId },
        include: {
          Question: true
        }
      })
      return templates
    } catch (error) {

    }
  }

  async findOne(id: string) {
    try {
      let template = await this.prisma.template.findUnique({
        where: { id },
        include: {
          Question: {
            include: { Options: true }
          },
        }
      })
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

  async remove(ids: string[]) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No template IDs provided');
      }

      const existingTemplates = await this.prisma.template.findMany({
        where: { id: { in: ids } }
      });

      if (existingTemplates.length === 0) {
        throw new NotFoundException('No matching templates found to delete');
      }

      const deleted = await this.prisma.template.deleteMany({
        where: { id: { in: ids } }
      });

      if (deleted.count > 0) {
        return { message: `${deleted.count} template(s) successfully deleted!` };
      }
    } catch (error) {
      console.log(error);
    }
  }

}
