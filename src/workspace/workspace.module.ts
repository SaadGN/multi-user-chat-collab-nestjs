import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entity/workspace.entity';
import { JwtModule } from '@nestjs/jwt';
import authConfig from 'src/config/auth.config';
import { WorkspaceMember } from './entity/workspace-member.entity';
import { UserModule } from 'src/user/user.module';
import { WorkspaceInvite } from './entity/workspace-invite.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  imports: [
    TypeOrmModule.forFeature([Workspace,WorkspaceInvite,WorkspaceMember]),
    JwtModule.registerAsync(authConfig.asProvider()),
    UserModule,
    MailModule
  ],
  exports:[WorkspaceService]
})
export class WorkspaceModule { }
