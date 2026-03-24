import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { Repository } from 'typeorm';
import { WorkspaceService } from 'src/workspace/workspace.service';

@Injectable()
export class ChatService {

    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        private workspaceService: WorkspaceService
    ) { }

    getWorkspaceRoom(workspaceId: number) {
        return `ws:${workspaceId}`;
    }

    async validateUser(workspaceId: number, userId: number) {
        const isMember = await this.workspaceService.isUserInWorkspace(userId, workspaceId)

        if (!isMember) {
            throw new BadRequestException("User not in workspace")
        }
    }

    async saveMessage(workspaceId: number, senderId: number, message: string) {
        await this.validateUser(workspaceId, senderId);

        const msg = this.messageRepository.create({
            workspaceId,
            senderId,
            message
        })
        return this.messageRepository.save(msg)
    }

    async getMessages(workspaceId: number) {
        return this.messageRepository.find({
            where: { workspaceId },
            order: { createdAt: 'ASC' },
        })
    }
}
