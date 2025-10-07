import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator"
import { userRole } from "./role.enum"

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

    @IsNotEmpty()
    @IsEnum(userRole)
    role:userRole


}