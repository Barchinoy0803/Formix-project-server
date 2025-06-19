import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested, IsBoolean, IsArray, IsNumber, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { QUESTION_ANSWER_TYPE } from '@prisma/client';

class CreateOptionDto {
    @IsString()
    title: string;

    @IsOptional()
    isSelected?: boolean;
}

export class CreateQuestionDto {
    @IsInt()
    @IsNotEmpty()
    sequence: number

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsEnum(QUESTION_ANSWER_TYPE)
    type: QUESTION_ANSWER_TYPE;

    @IsBoolean()
    isPublished: boolean;

    @IsString()
    templateId: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOptionDto)
    options?: CreateOptionDto[];
}
