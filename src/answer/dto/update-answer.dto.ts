import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAnswerDto {
  @IsString()
  @IsOptional() 
  id?: string;

  @IsNumber()
  @IsNotEmpty()
  sequence: number;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsString()
  @IsNotEmpty()
  questionId: string;
}
