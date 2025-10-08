import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dtos/workspace.dto';
import { retry } from 'rxjs';

@Controller('workspace')
export class WorkspaceController {
    constructor(
        private readonly workspaceService:WorkspaceService
    ){}

    @Get()
    getAllWorkspaces(){
        return this.workspaceService.getAllWorkspaces()
    }

    @Post()
    createWorkspace(@Body() workspaceDto:CreateWorkspaceDto){
        return this.workspaceService.createWorkspace(workspaceDto)
    }
    
    @Delete(':id')
    deleteWorkspace(@Param('id',ParseIntPipe) id:number){
        return this.workspaceService.deleteWorkspace(id)
    }
}
