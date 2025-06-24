import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsStringOrStringArray } from './custom-validator';

export class UpdateAnswerDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsNumber()
  @IsNotEmpty()
  sequence: number;

  @IsStringOrStringArray()
  @IsOptional()
  answer: string | string[];

  @IsString()
  @IsNotEmpty()
  questionId: string;
}
