import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { CreateInviteDto } from './invite/dto/invite.dto';
import { AdminService } from './admin.service';
import { AuthorizeGuard } from 'src/guards/authorize.guard';
import { AdminDecorator } from 'src/auth/decorators/admin.decorator';
import { CreateWorkspaceInviteDto } from 'src/workspace/dtos/create-workspace-invite.dto';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService:AdminService
    ) { }

    @UseGuards(AuthorizeGuard)
    @AdminDecorator()
    @Post('invite')
    sendInviteLink(
        @Body() inviteDto:CreateInviteDto
    ){
        return this.adminService.sendInviteLink(inviteDto)
    }


    @UseGuards(AuthorizeGuard)
    @AdminDecorator()
    @Post('workspace/invite')
    async sendInvite(@Body() inviteDto:CreateWorkspaceInviteDto){
        return await this.adminService.sendWorkspaceInvite(inviteDto);
    }

}
