import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { AuthGuard } from '../guards/auth.guard';
import { OwnerGuard } from '../guards/owner.guard';
import { OwnerEntity } from '../decorators/owner-entity.decorator';

@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.create(createOptionDto);
  }

  @Get()
  findAll() {
    return this.optionsService.findAll();
  }

  @UseGuards(AuthGuard, OwnerGuard)
  @OwnerEntity('option')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.optionsService.remove(id);
  }
}
