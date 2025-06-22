import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AuthGuard } from '../guards/auth.guard';
import { OwnerGuard } from '../guards/owner.guard';
import { OwnerEntity } from '../decorators/owner-entity.decorator';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @Post()
  @UseGuards(AuthGuard)
  async createMany(
    @Body() createQuestionDtos: CreateQuestionDto[],
    @Req() req: Request
  ) {
    return this.questionService.create(createQuestionDtos, req);
  }


  @Get()
  async findAll(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    let user: any = undefined;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.ACCESS_KEY_SECRET as string;

      if (!secret) throw new Error('ACCESS_KEY_SECRET is missing in .env');

      try {
        user = jwt.verify(token, secret);
      } catch (err) {
        console.warn('Invalid token, treating as guest.');
      }
    }

    return this.questionService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @UseGuards(AuthGuard, OwnerGuard)
  @OwnerEntity('question')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(id, updateQuestionDto);
  }

  @UseGuards(AuthGuard, OwnerGuard)
  @OwnerEntity('question')
  @Delete()
  remove(@Body('ids') ids: string | string[]) {
    const idArray = typeof ids === 'string' ? ids.split(',') : ids;
    return this.questionService.remove(idArray);
  }
}
