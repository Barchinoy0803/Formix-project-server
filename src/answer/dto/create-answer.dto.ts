import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAnswerDto {
  @IsNumber()
  @IsNotEmpty()
  sequence: number;

  @IsOptional()
  answer: string | string[];

  @IsString()
  @IsNotEmpty()
  questionId: string;
}
