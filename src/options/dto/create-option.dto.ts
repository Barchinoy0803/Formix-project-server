import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class CreateOptionDto {
    @IsString()
    @IsNotEmpty()
    questionId: string

    @IsString()
    @IsNotEmpty()
    title: string

    @IsBoolean()
    @IsNotEmpty()
    isSelected: boolean
}
