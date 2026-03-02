import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { Invite } from './invite/entity/invite.entity';
import { JwtModule } from '@nestjs/jwt';
import authConfig from 'src/config/auth.config';
import { MailModule } from 'src/mail/mail.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { WorkspaceInvite } from './invite/entity/workspace-invite.entity';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    TypeOrmModule.forFeature([User, Invite,WorkspaceInvite]),
    UserModule,
    JwtModule.registerAsync(authConfig.asProvider()),
    MailModule,
    WorkspaceModule
  ],
  exports: [AdminService]
})
export class AdminModule { }


