import { IsOptional, IsString, MinLength } from "class-validator"

export class UpdateWokspaceDto {
    @IsString()
    @IsOptional()
    @MinLength(1)
    name?: string

    @IsString()
    @IsOptional()
    description?: string
}