import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    context: string

    @IsString()
    @IsNotEmpty()
    templateId: string

    @IsString()
    @IsOptional()
    userId: string
}