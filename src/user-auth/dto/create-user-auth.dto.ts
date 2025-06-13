import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateUserAuthDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}
