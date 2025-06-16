import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class CreateUserDto {
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
