import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Request } from 'express';
import { OwnerEntity } from '../decorators/owner-entity.decorator';
import { OwnerGuard } from '../guards/owner.guard';
import { AuthGuard } from '../guards/auth.guard';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createFormDto: CreateFormDto, @Req() req: Request) {
    return this.formService.create(createFormDto, req);
  }

  @Get()
  findAll() {
    return this.formService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('all-forms')
  findAllUserForms(@Req() req: Request) {
    return this.formService.findAllUserForms(req);
  }

  @UseGuards(AuthGuard)
  @Get('forms')
  findForms(@Req() req: Request) {
    return this.formService.findForms(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formService.findOne(id);
  }

  @UseGuards(AuthGuard, OwnerGuard)
  @OwnerEntity('form')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formService.update(id, updateFormDto);
  }

  @UseGuards(AuthGuard, OwnerGuard)
  @OwnerEntity('form')
  @Delete()
  remove(@Body('ids') ids: string | string[]) {
    const idArray = typeof ids === 'string' ? ids.split(',') : ids;
    return this.formService.remove(idArray);
  }
}
