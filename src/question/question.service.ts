import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { QUESTION_ANSWER_TYPE, ROLE } from '@prisma/client';

@Injectable()
export class QuestionService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(createQuestionDtos: CreateQuestionDto[], req: Request) {
    try {
      const createdById = req['user'].id;

      const createdQuestions = await Promise.all(
        createQuestionDtos.map(async (dto) => {
          const { Options, ...questionData } = dto;

          const question = await this.prisma.question.create({
            data: {
              ...questionData,
              description: dto.description ?? '',
              createdById,
              sequence: dto.sequence,
              Options: Options?.length
                ? {
                  create: Options.map((opt) => ({
                    title: opt.title,
                    isSelected: opt.isSelected ?? false,
                  })),
                }
                : undefined,
            },
            include: {
              Options: true,
            },
          });

          return question;
        })
      );

      return createdQuestions;
    } catch (error) {
      throw new HttpException('Failed to create questions', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(currentUser?: { id: string, role: ROLE }) {
    try {
      let whereCondition = {}

      if (!currentUser) {
        whereCondition = { isPublished: true }
      } else if (currentUser.role === ROLE.ADMIN) {
        whereCondition = {}
      } else {
        whereCondition = {
          OR: [
            { isPublished: true },
            { createdById: currentUser.id }
          ]
        }
      }

      const questions = await this.prisma.question.findMany(
        {
          where: whereCondition,
          include: { Options: true }
        }
      )
      return questions
    } catch (error) {
      throw error
    }
  }

  async findOne(id: string) {
    try {
      let question = await this.prisma.question.findUnique({ where: { id }, include: { Options: true } })
      if (!question) {
        return new HttpException("Not found this question", HttpStatus.NOT_FOUND)
      }
      return question
    } catch (error) {
      throw error
    }
  }

  async getTemplateQuestions(templateId: string) {
    try {
      let questions = await this.prisma.question.findMany({ where: { templateId, isPublished: true } })
      return questions
    } catch (error) {
      throw error
    }
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    try {
      const {
        Options,
        ...rest
      } = updateQuestionDto;

      const updated = await this.prisma.question.update({
        where: { id },
        data: {
          ...rest,
          ...(Options && {
            Options: {
              deleteMany: {},
              create: Options.map((o) => ({
                title: o.title,
                isSelected: o.isSelected ?? false
              }))
            }
          })
        },
        include: {
          Options: true
        }
      });

      return updated;
    } catch (error) {
      throw new Error("Update failed");
    }
  }

  async remove(ids: string[]) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No question IDs provided');
      }

      const existingTemplates = await this.prisma.question.findMany({
        where: { id: { in: ids } }
      });

      if (existingTemplates.length === 0) {
        throw new NotFoundException('No matching question found to delete');
      }

      const deleted = await this.prisma.question.deleteMany({
        where: { id: { in: ids } }
      });

      if (deleted.count > 0) {
        return { message: `${deleted.count} question(s) successfully deleted!` };
      }
    } catch (error) {
      throw error
    }
  }
}
