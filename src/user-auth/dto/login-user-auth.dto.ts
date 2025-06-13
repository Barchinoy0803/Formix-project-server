import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class LoginUserAuthDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}
