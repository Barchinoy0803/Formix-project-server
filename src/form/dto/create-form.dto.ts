  import { Type } from "class-transformer";
  import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
  import { CreateAnswerDto } from "../../answer/dto/create-answer.dto";

  export class CreateFormDto {
    @IsString()
    @IsNotEmpty()
    templateId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAnswerDto)
    @IsOptional()
    Answer?: CreateAnswerDto[];
  }
