import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkspaceInvite } from "./entity/workspace-invite.entity";
import { WorkspaceMember } from "../entity/workspace-member.entity";
import { UserModule } from "src/user/user.module";
import { WorkspaceModule } from "../workspace.module";
import { WorkspaceInviteController } from "./workspace-invite.controller";
import { WorkspaceInviteService } from "./workspace-invite.service";
import { JwtModule } from "@nestjs/jwt";
import authConfig from "src/config/auth.config";
import { MailModule } from "src/mail/mail.module";


@Module({
    imports:[
        TypeOrmModule.forFeature([WorkspaceInvite,WorkspaceMember]),
        UserModule,
        WorkspaceModule,
        MailModule,
        JwtModule.registerAsync(authConfig.asProvider())
    ],
    controllers:[WorkspaceInviteController],
    providers:[WorkspaceInviteService]
})
export class WorkspaceInviteModule{}