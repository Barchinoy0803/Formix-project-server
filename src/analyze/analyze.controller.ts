import { Controller, Get, Param } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.analyzeService.findAnalyzeForQuestion(id);
  }
}
