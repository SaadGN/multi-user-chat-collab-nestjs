import { IsString, IsNotEmpty, MaxLength, IsOptional } from "class-validator"

export class CreateWorkspaceDto{
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name:string

    @IsString()
    @MaxLength(100)
    @IsOptional()
    description:string
}
