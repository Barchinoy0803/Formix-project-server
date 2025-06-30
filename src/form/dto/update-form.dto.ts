import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UpdateAnswerDto } from '../../answer/dto/update-answer.dto';

export class AnswerDto {
  id?: string;

  @IsInt()
  sequence: number;

  @IsString({ each: true }) // or union for string | string[]
  answer: string | string[];

  @IsUUID()
  questionId: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  selectedOptionOnAnswer?: string[]; // List of selected option IDs
}

export class UpdateFormDto {
  @IsOptional()
  @IsUUID()
  templateId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  Answer: AnswerDto[];
}

