import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { userRole } from 'src/user/enums/role.enum';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Invite } from './invite/entity/invite.entity';
import { CreateInviteDto } from './invite/dto/invite.dto';
import { UserService } from 'src/user/user.service';
import { randomBytes } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { WorkspaceInvite } from './invite/entity/workspace-invite.entity';
import { CreateWorkspaceInviteDto } from './invite/dto/ceate-workspace-invite.dto';

@Injectable()
export class AdminService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Invite)
        private inviteRepository: Repository<Invite>,

        private readonly userService: UserService,

        private readonly mailService: MailService,

        @InjectRepository(WorkspaceInvite)
                private workspaceInviteRepository: Repository<WorkspaceInvite>,
                private workspaceService: WorkspaceService
    ) { }

    async createDefaultAdmin() {

        const existingUser = await this.userRepository.findOne({
            where: { role: userRole.ADMIN }
        })

        if (existingUser) {
            console.log("ADMIN alreasy consists")
            return
        }

        const email = process.env.ADMIN_EMAIL
        const username = process.env.ADMIN_USERNAME
        const password = process.env.ADMIN_PASSWORD
        if (!email || !username || !password) {
            console.log('Missing admin credentials');
            return;
        }


        let user: CreateUserDto = {
            username: username,
            email: email,
            password: password,
            role: userRole.ADMIN
        }

        let adminUser = await this.userRepository.create(user)

        await this.userRepository.save(adminUser)


        console.log("Default Admin Created")
    }

    async sendInviteLink(inviteDto: CreateInviteDto) {

        try {

            const { email } = inviteDto

            const existingUser = await this.userService.findUserByMail(email)

            if (existingUser) {
                throw new BadRequestException(`User with email ${email} already exists!`)
            }

            const existingInvite = await this.inviteRepository.findOne({
                where: { email }
            })
            if (existingInvite && existingInvite.expiresAt > new Date()) {
                throw new BadRequestException(`Invite has already been sent to email ${email}`)
            }
            const token = randomBytes(32).toString('hex')
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)    //24 hours

            const invite = this.inviteRepository.create({
                email,
                token,
                expiresAt
            })
            await this.inviteRepository.save(invite)

            await this.mailService.sendInvite(email, token)

            return {
                success: true,
                message: "Invitation mail sent successfully"
            }
        } catch (error) {
            throw error
        }
    }

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
    
}


