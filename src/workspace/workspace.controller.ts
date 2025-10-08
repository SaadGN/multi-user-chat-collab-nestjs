import { Body, Controller, Post } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dtos/workspace.dto';

@Controller('workspace')
export class WorkspaceController {
    constructor(
        private readonly workspaceService:WorkspaceService
    ){}

    @Post()
    public createWorkspace(@Body() workspaceDto:CreateWorkspaceDto){
        return this.workspaceService.createWorkspace(workspaceDto)
    }
    
}
