import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, RequestTimeoutException } from '@nestjs/common';
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
            const workspaceEntity = this.workspaceRepository.create(workspaceDto)

            //save workspace
            await this.workspaceRepository.save(workspaceEntity)

            return {
                success: true,
                message: `Workspace Created successfully`,
                data: workspaceEntity
            }
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new RequestTimeoutException("Error has occured.Try again later", {
                    description: 'Could not connect to database!'
                })
            }
            throw error
        }
    }

    public async getAllWorkspaces() {
        try {
            return this.workspaceRepository.find()
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new RequestTimeoutException("Error has occured.Try again later", {
                    description: 'Could not connect to database!'
                })
            }
            throw error
        }
    }

    public async deleteWorkspace(id: number) {
        try {
            //check if workspace exists
            const workspace = await this.workspaceRepository.findOne({
                where: { id }
            })
            if (!workspace) {
                throw new NotFoundException(`Workspace with id ${id} does not exist`)
            }

            // delete workspace from db
            await this.workspaceRepository.delete(id)
            return {
                success: true,
                message: `workspace with id ${id} deleted successfully`
            }
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new RequestTimeoutException("Error has occured.Try again later", {
                    description: 'Could not connect to database!'
                })
            }
            throw error
        }
    }

}
