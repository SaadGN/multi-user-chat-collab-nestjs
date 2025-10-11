import { Controller, Body, Post } from '@nestjs/common';
import { CreateInviteDto } from './invite/dto/invite.dto';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService:AdminService
    ) { }

    @Post('invite')
    sendInviteLink(
        @Body() inviteDto:CreateInviteDto
    ){
        return this.adminService.sendInviteLink(inviteDto)
    }

}
