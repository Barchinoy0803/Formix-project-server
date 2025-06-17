import { FORM_TYPE } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

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
}
