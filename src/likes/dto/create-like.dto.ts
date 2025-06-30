import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateLikeDto {
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
