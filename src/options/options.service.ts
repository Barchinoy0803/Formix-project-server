import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OptionsService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(createOptionDto: CreateOptionDto) {
    try {
      let option = await this.prisma.options.create({ data: createOptionDto })
      return option
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      let options = await this.prisma.options.findMany()
      return options
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.options.delete({ where: { id } })
      return { message: "Deleted successfully" }
    } catch (error) {
      throw error;
    }
  }
}
