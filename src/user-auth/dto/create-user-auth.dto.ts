import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class CreateUserAuthDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsStrongPassword()
    @IsString()
    @IsNotEmpty()
    password: string
}
