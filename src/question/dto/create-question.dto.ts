import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested, IsBoolean, IsArray, IsNumber, IsInt, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { QUESTION_ANSWER_TYPE } from '@prisma/client';

class CreateOptionDto {
    @IsString()
    title: string;

    @IsOptional()
    isSelected?: boolean;
}

export class CreateQuestionDto {
    @IsUUID()
    @IsOptional()
    id: string;

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

    @IsOptional()
    @IsString()
    templateId: string;

    @IsOptional()
    @IsString()
    createdById?: string

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOptionDto)
    Options?: CreateOptionDto[];
}
