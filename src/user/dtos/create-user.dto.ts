import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    username: string

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(30)
    email: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    password: string

    @IsString()
    @IsNotEmpty()
    role: string


}