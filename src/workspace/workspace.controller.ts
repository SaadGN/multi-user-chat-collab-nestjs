import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dtos/workspace.dto';
import { UpdateWokspaceDto } from './dtos/update-workspace.dto';
import { AuthorizeGuard } from 'src/guards/authorize.guard';
import { AdminDecorator } from 'src/auth/decorators/admin.decorator';
import { MemberDecorator } from 'src/auth/decorators/member.decorator';
import { REQ_USER } from 'src/constants/user.constant';


@Controller('workspace')
export class WorkspaceController {
    constructor(
        private readonly workspaceService: WorkspaceService
    ) { }

    @UseGuards(AuthorizeGuard)
    @MemberDecorator()
    @Get("invite")
    async acceptInvite(@Query('token') token: string, @Req() req: Request) {
        const result = await this.workspaceService.acceptWorkspaceInvite(token, req[REQ_USER]);
        return result;
    }

    @UseGuards(AuthorizeGuard)
    @AdminDecorator()
    @Get()
    getAllWorkspaces() {
        return this.workspaceService.getAllWorkspaces()
    }

    @UseGuards(AuthorizeGuard)
    @Get('id/:id')
    findWorkspaceById(@Param('id', ParseIntPipe) id: number) {
        return this.workspaceService.findWorkspaceById(id)
    }

    @UseGuards(AuthorizeGuard)
    @AdminDecorator()
    @Post()
    createWorkspace(@Body() workspaceDto: CreateWorkspaceDto) {
        return this.workspaceService.createWorkspace(workspaceDto)
    }

    @UseGuards(AuthorizeGuard)
    @AdminDecorator()
    @Delete(':id')
    deleteWorkspace(@Param('id', ParseIntPipe) id: number) {
        return this.workspaceService.deleteWorkspace(id)
    }

    @UseGuards(AuthorizeGuard)
    @AdminDecorator()
    @Patch(':id')
    updateWorkspace(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateWorkspaceDto: UpdateWokspaceDto
    ) {
        return this.workspaceService.updateWorkspace(id, updateWorkspaceDto)
    }

}
