import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkspaceInvite } from "./entity/workspace-invite.entity";
import { Repository } from "typeorm";
import { UserService } from "src/user/user.service";
import { WorkspaceService } from "../workspace.service";
import { MailService } from "src/admin/invite/mail/mail.service";
import { randomBytes } from "crypto";
import { CreateWorkspaceInviteDto } from "./dto/create-workspace-invite.dto";
import { WorkspaceMember } from "../entity/workspace-member.entity";


@Injectable()
export class WorkspaceInviteService {
    constructor(
        @InjectRepository(WorkspaceInvite)
        private workspaceInviteRepository: Repository<WorkspaceInvite>,
        private userService: UserService,
        private workspaceService: WorkspaceService,
        private mailService: MailService,

        @InjectRepository(WorkspaceMember)
        private workspaceMemberRepository: Repository<WorkspaceMember>
    ) { }

    async sendWorkspaceInvite(inviteDto: CreateWorkspaceInviteDto) {
        try {
            const { email, workspaceId } = inviteDto;

            const existingUser = await this.userService.findUserByMail(email)

            if (!existingUser) {
                throw new BadRequestException(`User with email ${email} does not exist`)
            }

            const workspace = await this.workspaceService.findWorkspaceById(workspaceId)

            if (!workspace) {
                throw new BadRequestException(`Workspace not found`)
            }

            const existingInvite = await this.workspaceInviteRepository.findOne({
                where: { email, workspaceId }
            })
            if (existingInvite && existingInvite.expiresAt > new Date()) {
                throw new BadRequestException(`Invite already sent to email ${email}`)
            }

            const token = randomBytes(32).toString('hex')
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

            const invite = this.workspaceInviteRepository.create({
                email,
                token,
                workspaceId,
                isAccepted: false,
                expiresAt
            })

            await this.workspaceInviteRepository.save(invite)
            await this.mailService.sendWorkspaceInvite(email, token)

            return {
                success: true,
                message: `Workspace invitation mail sent successfully!`
            }
        } catch (error) {
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