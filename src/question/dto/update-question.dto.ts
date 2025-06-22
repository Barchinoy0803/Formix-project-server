import { QUESTION_ANSWER_TYPE } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateOptionDto } from "../../options/dto/create-option.dto";

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  sequence?: number;

  @IsOptional()
  type?: QUESTION_ANSWER_TYPE;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;


  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  Options?: CreateOptionDto[];
}
