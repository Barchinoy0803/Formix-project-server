import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IsStringOrStringArray } from "./custom-validator";

export class CreateAnswerDto {
  @IsNumber()
  @IsNotEmpty()
  sequence: number;

  @IsOptional()
  @IsStringOrStringArray()
  answer: string | string[];

  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsOptional()
  options?: { id: string; isSelected: boolean }[];

}
