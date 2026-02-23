import { IsEmail, IsNotEmpty, MaxLength } from "class-validator"

export class CreateInviteDto{
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email:string
}
