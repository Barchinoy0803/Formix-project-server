import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { SelfGuard } from 'src/guards/self.guard';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createTemplateDto: CreateTemplateDto, @Req() req: Request) {
    return this.templateService.create(createTemplateDto, req);
  }

  @Get()
  findAll() {
    return this.templateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateDto) {
    return this.templateService.update(id, updateTemplateDto);
  }

  @UseGuards(AuthGuard, SelfGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templateService.remove(id);
  }
}
