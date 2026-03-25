import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { ChatGateway } from './chat.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    WorkspaceModule,
    JwtModule],
  providers: [ChatGateway, ChatService],

})
export class ChatModule { }
