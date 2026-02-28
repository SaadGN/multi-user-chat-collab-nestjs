import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";


export class CreateWorkspaceInviteDto{
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsNumber()
    @IsNotEmpty()
    workspaceId:number
}