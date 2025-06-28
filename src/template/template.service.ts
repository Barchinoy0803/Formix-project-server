import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { FORM_TYPE, Prisma } from '@prisma/client';

@Injectable()
export class TemplateService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createTemplateDto: CreateTemplateDto, req: Request) {
    try {
      const userId = req['user'].id;
      const { Question, allowedUsers, ...templateData } = createTemplateDto;

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
                    create: q.Options?.map((o) => ({ title: o.title })) ?? [],
                  },
                })),
              },
            }
            : {}),
          ...(templateData.type === 'PRIVATE' && allowedUsers?.length
            ? {
              TemplateAccess: {
                create: allowedUsers.map((user) => ({
                  userId: user.id,
                })),
              },
            }
            : {}),
        },
        include: {
          Question: {
            include: { Options: true },
          },
          TemplateAccess: true,
        },
      });

      return template;
    } catch (error) {
      console.error(error);
      throw new HttpException('Template creation failed', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(req: Request, search?: string) {
    try {
      const userId = req['user']?.id;

      const whereCondition: any = {
        type: FORM_TYPE.PUBLIC,
      };

      if (search) {
        whereCondition.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const templates = await this.prisma.template.findMany({
        where: {
          OR: [
            whereCondition,
            ...(userId
              ? [
                {
                  type: FORM_TYPE.PRIVATE,
                  TemplateAccess: {
                    some: {
                      userId,
                    },
                  },
                },
              ]
              : []),
          ],
        },
        include: {
          TemplateAccess: true,
        },
      });

      return templates;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  async findAllUserTemplates(req: Request, search?: string) {
    try {
      const userId = req['user'].id;

      const whereCondition: any = {
        userId,
      };

      if (search) {
        whereCondition.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      let templates = await this.prisma.template.findMany({
        where: whereCondition,
        include: {
          Question: true,
        },
      });
      return templates;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    try {
      const template = await this.prisma.template.findUnique({
        where: { id },
        include: {
          Question: { include: { Options: true } },
          TemplateAccess: {
            select: {
              user: { select: { id: true, username: true } },
            },
          },
        },
      });

      if (!template) throw new NotFoundException('Not found');

      const allowedUsers = (template.TemplateAccess ?? []).map((a) => ({
        id: a.user.id,
        username: a.user.username,
      }));

      const { TemplateAccess: _, ...rest } = template;
      return { ...rest, TemplateAccess: allowedUsers };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update(id: string, dto: UpdateTemplateDto) {
    const {
      Question: qs = [],
      allowedUsers,
      TemplateAccess: tAcc,
      ...tpl
    } = dto as any;

    const ex = await this.prisma.template.findUnique({
      where: { id },
      include: { Question: true },
    });
    if (!ex) throw new HttpException('Template not found', 404);

    await this.prisma.question.deleteMany({
      where: {
        id: {
          in: ex.Question.filter((q) => !qs.some((i) => i.id === q.id)).map(
            (q) => q.id,
          ),
        },
      },
    });

    const qUpd = qs
      .filter((q) => q.id)
      .map((q) => ({
        where: { id: q.id },
        data: {
          title: q.title,
          sequence: q.sequence,
          description: q.description ?? '',
          type: q.type,
          isPublished: q.isPublished,
          Options: {
            deleteMany: {},
            create: q.Options?.map((o) => ({ title: o.title })) ?? [],
          },
        },
      }));

    const qNew = qs
      .filter((q) => !q.id)
      .map((q) => ({
        title: q.title,
        sequence: q.sequence,
        description: q.description ?? '',
        type: q.type,
        isPublished: q.isPublished,
        Options: { create: q.Options?.map((o) => ({ title: o.title })) ?? [] },
      }));

    const ids = [
      ...new Set(
        (allowedUsers ?? tAcc ?? [])
          .map((u: any) => ('id' in u ? u.id : u.user?.id))
          .filter(Boolean),
      ),
    ] as string[];

    const data: Prisma.TemplateUpdateInput = {
      ...tpl,
      Question: { update: qUpd, create: qNew },
      TemplateAccess:
        tpl.type === 'PRIVATE'
          ? {
            deleteMany: {},
            createMany: {
              data: ids.map((userId) => ({ userId })),
              skipDuplicates: true,
            },
          }
          : { deleteMany: {} },
    };

    const updated = await this.prisma.template.update({
      where: { id },
      data,
      include: {
        Question: { include: { Options: true } },
        TemplateAccess: {
          select: { user: { select: { id: true, username: true } } },
        },
      },
    });

    const allowed = updated.TemplateAccess.map((a) => ({
      id: a.user.id,
      username: a.user.username,
    }));
    const { TemplateAccess, ...rest } = updated;
    return { ...rest, TemplateAccess: allowed };
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
      throw new HttpException(
        'Failed to delete templates',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
