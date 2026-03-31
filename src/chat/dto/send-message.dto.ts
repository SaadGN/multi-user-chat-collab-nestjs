import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class SendMessageDto{
    
    @IsNumber()
    @IsNotEmpty()
    workspaceId:number

    @IsString()
    @IsNotEmpty()
    message:string

}