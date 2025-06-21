import { FORM_TYPE } from "@prisma/client"
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray
} from "class-validator"
import { Type } from "class-transformer"
import { CreateQuestionDto } from "../../question/dto/create-question.dto" // adjust path if needed

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  topic: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsOptional()
  image: string

  @IsEnum(FORM_TYPE)
  @IsNotEmpty()
  type: FORM_TYPE

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  @IsOptional()
  Question?: CreateQuestionDto[]
}
