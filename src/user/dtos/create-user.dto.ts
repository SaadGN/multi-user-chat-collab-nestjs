import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"
import { userRole } from "../enums/role.enum"

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

    @IsEnum(userRole)
    @IsOptional()
    role?:userRole


}