import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UpdateAnswerDto } from '../../answer/dto/update-answer.dto';

export class UpdateFormDto {
  @IsOptional()
  @IsString()
  templateId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAnswerDto)
  @IsOptional()
  Answer?: UpdateAnswerDto[];
}
