import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Request } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { OwnerGuard } from '../guards/owner.guard';
import { OwnerEntity } from '../decorators/owner-entity.decorator';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createTemplateDto: CreateTemplateDto, @Req() req: Request) {
    return this.templateService.create(createTemplateDto, req);
  }

  @Get()
  findAll() {
    return this.templateService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('owner')
  findAllUserTemplates(@Req() req: Request) {
    return this.templateService.findAllUserTemplates(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

  @UseGuards(AuthGuard, OwnerGuard)
  @OwnerEntity('template')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templateService.update(id, updateTemplateDto);
  }

  @UseGuards(AuthGuard, OwnerGuard)
  @OwnerEntity('template')
  @Delete()
  remove(@Body('ids') ids: string | string[]) {
    const idArray = typeof ids === 'string' ? ids.split(',') : ids;
    return this.templateService.remove(idArray);
  }
}
