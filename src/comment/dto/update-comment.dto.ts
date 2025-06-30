import { IsOptional, IsString } from "class-validator"

export class UpdateCommentDto {
    @IsString()
    @IsOptional()
    context: string

    @IsString()
    @IsOptional()
    templateId: string

    @IsString()
    @IsOptional()
    userId: string
}
