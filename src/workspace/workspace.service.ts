import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entity/workspace.entity';
import { Repository } from 'typeorm';
import { CreateWorkspaceDto } from './dtos/workspace.dto';

@Injectable()
export class WorkspaceService {
    constructor(
        @InjectRepository(Workspace)
        private readonly workspaceRepository: Repository<Workspace>
    ) { }

    public async createWorkspace(workspaceDto: CreateWorkspaceDto) {
        try {

            //check for workspace with same name
            const existingWorkspace = await this.workspaceRepository.findOne({
                where: { name: workspaceDto.name }
            })
            if (existingWorkspace) {
                throw new BadRequestException(`Workspace with name ${workspaceDto.name} already exists!`)
            }

            // create a workspace
            let workspaceEntity = this.workspaceRepository.create(workspaceDto)

            //save workspace
            await this.workspaceRepository.save(workspaceEntity)

            return {
                success: true,
                message: `Workspace ${workspaceDto.name} Created successfully`
            }
        } catch (error) {
            throw error
        }
    }

}
