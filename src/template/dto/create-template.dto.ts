import { FORM_TYPE } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"

export class CreateTemplateDto {
    @IsString()
    @IsNotEmpty()
    topic: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    image: string

    @IsEnum(FORM_TYPE)
    @IsNotEmpty()
    type: FORM_TYPE
}
