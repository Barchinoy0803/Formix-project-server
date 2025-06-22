import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { FORM_TYPE } from '@prisma/client';

@Injectable()
export class TemplateService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(createTemplateDto: CreateTemplateDto, req: Request) {
    try {
      const userId = req['user'].id;
      const { Question, ...templateData } = createTemplateDto;

      const template = await this.prisma.template.create({
        data: {
          ...templateData,
          userId,
          ...(Question?.length
            ? {
              Question: {
                create: Question.map((q) => ({
                  title: q.title,
                  sequence: q.sequence,
                  description: q.description ?? '',
                  type: q.type,
                  isPublished: q.isPublished,
                  createdById: userId,
                  Options: {
                    create: q.Options?.map((o) => ({
                      title: o.title,
                      isSelected: o.isSelected ?? false,
                    })) ?? [],
                  },
                })),
              },
            }
            : {}),
        },
        include: {
          Question: {
            include: { Options: true },
          },
        },
      });

      return template;
    } catch (error) {
      console.error(error);
      throw new HttpException('Template creation failed', HttpStatus.BAD_REQUEST);
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
      const existingTemplate = await this.prisma.template.findUnique({
        where: { id },
        include: { Question: true }
      });

      const existingIds = existingTemplate?.Question.map(q => q.id) || [];
      const incomingIds = updateTemplateDto.Question?.filter(q => q.id).map(q => q.id) || [];

      const idsToDelete = existingIds.filter(existingId => !incomingIds.includes(existingId));

      await this.prisma.question.deleteMany({
        where: { id: { in: idsToDelete } }
      });

      const existingQuestions = updateTemplateDto.Question?.filter(q => q.id);
      const newQuestions = updateTemplateDto.Question?.filter(q => !q.id);

      const updated = await this.prisma.template.update({
        where: { id },
        data: {
          title: updateTemplateDto.title,
          topic: updateTemplateDto.topic,
          description: updateTemplateDto.description,
          image: updateTemplateDto.image,
          type: updateTemplateDto.type,

          Question: {
            update: existingQuestions?.map(q => ({
              where: { id: q.id },
              data: {
                title: q.title,
                sequence: q.sequence,
                description: q.description ?? '',
                type: q.type,
                isPublished: q.isPublished,
              }
            })) ?? [],
            create: newQuestions?.map(q => ({
              title: q.title,
              sequence: q.sequence,
              description: q.description ?? '',
              type: q.type,
              isPublished: q.isPublished,
              Options: {
                create: q.Options?.map(o => ({
                  title: o.title,
                  isSelected: o.isSelected ?? false
                })) ?? []
              }
            })) ?? []
          }
        },
        include: {
          Question: { include: { Options: true } }
        }
      });

      return updated;
    } catch (error) {
      console.log(error);
      throw new HttpException('Template update failed', HttpStatus.BAD_REQUEST);
    }
  }



  async remove(templateIds: string[]) {
    try {
      await this.prisma.options.deleteMany({
        where: {
          question: {
            templateId: {
              in: templateIds,
            },
          },
        },
      });

      await this.prisma.question.deleteMany({
        where: {
          templateId: {
            in: templateIds,
          },
        },
      });

      const deleted = await this.prisma.template.deleteMany({
        where: {
          id: { in: templateIds },
        },
      });

      return deleted;
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to delete templates', HttpStatus.BAD_REQUEST);
    }
  }


}
