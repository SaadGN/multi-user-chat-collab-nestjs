import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    username: string

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    password: string

    @IsString()
    @IsNotEmpty()
    @IsIn(["ADMIN", "MEMBER"], { message: "Role must be ADMIN or MEMBER" })
    role: "ADMIN" | "MEMBER";


}