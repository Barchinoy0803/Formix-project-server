import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FormService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(createFormDto: CreateFormDto, req: Request) {
    try {
      const userId = req['user'].id;
      const { Answer, ...formData } = createFormDto;

      const form = await this.prisma.form.create({
        data: {
          ...formData,
          userId,
          ...(Answer?.length
            ? {
              Answer: {
                create: Answer.map((a) => {
                  const isMultiChoice = Array.isArray(a.answer);

                  return {
                    userId,
                    sequence: a.sequence,
                    questionId: a.questionId,
                    answer: isMultiChoice ? 'MULTI' : String(a.answer),
                    ...(isMultiChoice
                      ? {
                        SelectedOptionOnAnswer: {
                          create: (a.answer as string[]).map((optionId) => ({
                            option: {
                              connect: { id: optionId },
                            },
                            isSelected: true,
                          })),
                        },
                      }
                      : {}),
                  };
                }),
              },
            }
            : {}),
        },
        include: {
          Answer: {
            include: {
              SelectedOptionOnAnswer: {
                include: {
                  option: true,
                },
              },
            },
          },
        },
      });

      return form;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create form');
    }
  }

  async findAll() {
    try {
      let forms = await this.prisma.form.findMany()
      return forms
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    try {
      let form = await this.prisma.form.findUnique({
        where: { id },
        include: { Answer: true }
      })
      if (!form) return new HttpException("Not found this user", HttpStatus.NOT_FOUND)
      return form
    } catch (error) {
      console.log(error);
    }
  }


  async update(id: string, updateFormDto: UpdateFormDto) {
    try {
      const existingForm = await this.prisma.form.findUnique({
        where: { id },
        include: { Answer: true },
      });

      if (!existingForm) {
        throw new NotFoundException('Form not found');
      }

      const existingIds = existingForm.Answer.map(a => a.id);
      const incoming = updateFormDto.Answer || [];

      const incomingIds = incoming.filter(a => a.id).map(a => a.id);
      const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
      const toUpdate = incoming.filter(a => a.id);
      const toCreate = incoming.filter(a => !a.id);

      await this.prisma.answer.deleteMany({
        where: { id: { in: idsToDelete } },
      });

      await Promise.all(toUpdate.map(a =>
        this.prisma.answer.update({
          where: { id: a.id },
          data: {
            sequence: a.sequence,
            answer: a.answer,
            questionId: a.questionId,
          },
        })
      ));

      await this.prisma.answer.createMany({
        data: toCreate.map(a => ({
          sequence: a.sequence,
          answer: a.answer,
          questionId: a.questionId,
          formId: id,
        })),
      });

      const updatedForm = await this.prisma.form.update({
        where: { id },
        data: {
          ...(updateFormDto.templateId && { templateId: updateFormDto.templateId }),
        },
        include: { Answer: true },
      });

      return updatedForm;

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update form');
    }
  }


  async remove(formIds: string[]) {
    try {
      await this.prisma.answer.deleteMany({
        where: {
          formId: {
            in: formIds,
          },
        },
      });

      const deleted = await this.prisma.form.deleteMany({
        where: {
          id: {
            in: formIds,
          },
        },
      });

      return {
        message: `${deleted.count} form(s) deleted successfully.`,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to delete forms', HttpStatus.BAD_REQUEST);
    }
  }


}
