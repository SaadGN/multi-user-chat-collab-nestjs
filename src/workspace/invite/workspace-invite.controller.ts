import { Body, Controller, Get, Post, Query, Req, SetMetadata, UseGuards } from "@nestjs/common";
import { WorkspaceInviteService } from "./workspace-invite.service";
import { CreateWorkspaceInviteDto } from "./dto/create-workspace-invite.dto";
import { AuthorizeGuard } from "src/guards/authorize.guard";
import { AdminDecorator } from "src/auth/decorators/admin.decorator";
import { MemberDecorator } from "src/auth/decorators/member.decorator";
import { REQ_USER } from "src/constants/user.constant";


@Controller('workspace/invite')
export class WorkspaceInviteController{
    constructor(
        private readonly workspaceInviteService:WorkspaceInviteService
    ){}

    @UseGuards(AuthorizeGuard)
    @AdminDecorator()
    @Post()
    async sendInvite(@Body() inviteDto:CreateWorkspaceInviteDto){
        return await this.workspaceInviteService.sendWorkspaceInvite(inviteDto);
    }

    @SetMetadata('roles', ['MEMBER'])
    @UseGuards(AuthorizeGuard)
    @Get()
    async acceptInvite(@Query('token') token:string,@Req() req:Request){
        const result = await this.workspaceInviteService.acceptWorkspaceInvite(token,req[REQ_USER]);
        return result;
    }
}