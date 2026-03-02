import { BadRequestException, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entity/workspace.entity';
import { Repository } from 'typeorm';
import { CreateWorkspaceDto } from './dtos/workspace.dto';
import { UpdateWokspaceDto } from './dtos/update-workspace.dto';
import { WorkspaceMember } from './entity/workspace-member.entity';
import { UserService } from 'src/user/user.service';
import { WorkspaceInvite } from 'src/admin/invite/entity/workspace-invite.entity';

@Injectable()
export class WorkspaceService {
    constructor(
        @InjectRepository(Workspace)
        private readonly workspaceRepository: Repository<Workspace>,

        @InjectRepository(WorkspaceInvite)
        private workspaceInviteRepository: Repository<WorkspaceInvite>,

        @InjectRepository(WorkspaceMember)
        private workspaceMemberRepository: Repository<WorkspaceMember>,

        private userService:UserService

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
                throw new NotFoundException(`Workspace with id ${id} not found`)
            }

            // delete workspace from db
            await this.workspaceRepository.delete(id)
            return {
                success: true,
                message: `Workspace with id ${id} deleted successfully`
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

    public async findWorkspaceById(id: number) {
        try {
            const workspace = await this.workspaceRepository.findOne({
                where: { id }
            })
            if (!workspace) {
                throw new NotFoundException(`Workspace with id ${id} not found!`)
            }
            return workspace

        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new RequestTimeoutException("Error has occured.Try again later", {
                    description: 'Could not connect to database!'
                })
            }
            throw error
        }
    }

    public async updateWorkspace(id: number, updateWorkspaceDto: UpdateWokspaceDto) {

        try {
            if (!updateWorkspaceDto.name && !updateWorkspaceDto.description) {
                throw new BadRequestException("No Data Entered")
            }
            // check if name exists it && does not match other workspace name
            if (updateWorkspaceDto.name) {
                const existingWorkspace = await this.workspaceRepository.findOne({
                    where: { name: updateWorkspaceDto.name }
                })
                if (existingWorkspace && existingWorkspace.id !== id) {
                    throw new BadRequestException(`Workspace with name ${updateWorkspaceDto.name} already exists!`)
                }
            }

            const updatedWorkspace = await this.workspaceRepository.preload({
                id,
                ...updateWorkspaceDto
            })
            if (!updatedWorkspace) {
                throw new NotFoundException(`Workspace with id ${id} not found!`)
            }

            await this.workspaceRepository.save(updatedWorkspace)

            return {
                success: true,
                message: "Workspace updated successfully!",
                data: updatedWorkspace
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

    async acceptWorkspaceInvite(token: string,authUser:any) {
        try {
            const invite = await this.workspaceInviteRepository.findOne({
                where: { token }
            })
            if (!invite) {
                throw new BadRequestException(`Invalid invite token`)
            }
            if (invite.isAccepted) {
                throw new BadRequestException(`Invite already used`)
            }
            if (invite.expiresAt < new Date()) {
                throw new BadRequestException(`Invite expired!`)
            }

            if(invite.email !== authUser.email){
                throw new BadRequestException(`Invite does not belong to user with email ${invite.email}`)
            }

            const user = await this.userService.findUserByMail(invite.email)
            if (!user) {
                throw new BadRequestException(`User not found!`)
            }

            const member = this.workspaceMemberRepository.create({
                user,
                workspace: { id: invite.workspaceId },
                role: 'MEMBER'
            })
            await this.workspaceMemberRepository.save(member)

            invite.isAccepted = true;
            await this.workspaceInviteRepository.save(invite)

            return {
                success: true,
                message: "Joined Workspace Successfully!"
            }
        } catch (error) {
            throw error
        }
    }
}
