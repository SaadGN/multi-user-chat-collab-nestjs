import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dtos/workspace.dto';
import { UpdateWokspaceDto } from './dtos/update-workspace.dto';

@Controller('workspace')
export class WorkspaceController {
    constructor(
        private readonly workspaceService: WorkspaceService
    ) { }

    @Get()
    getAllWorkspaces() {
        return this.workspaceService.getAllWorkspaces()
    }

    @Get(':id')
    findWorkspaceById(@Param('id', ParseIntPipe) id: number) {
        return this.workspaceService.findWorkspaceById(id)
    }

    @Post()
    createWorkspace(@Body() workspaceDto: CreateWorkspaceDto) {
        return this.workspaceService.createWorkspace(workspaceDto)
    }

    @Delete(':id')
    deleteWorkspace(@Param('id', ParseIntPipe) id: number) {
        return this.workspaceService.deleteWorkspace(id)
    }

    @Patch(':id')
    updateWorkspace(
        @Param('id',ParseIntPipe) id:number,
        @Body() updateWorkspaceDto:UpdateWokspaceDto
    ){
        return this.workspaceService.updateWorkspace(id,updateWorkspaceDto)
    }

}
