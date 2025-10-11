import { IsOptional, IsString, MaxLength } from "class-validator"

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @MaxLength(100)
    username?: string

    @IsString()
    @IsOptional()
    @MaxLength(100)
    password?: string

}