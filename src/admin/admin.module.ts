import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { Invite } from './invite/entity/invite.entity';
import { MailService } from './invite/mail/mail.service';
import { JwtModule } from '@nestjs/jwt';
import authConfig from 'src/config/auth.config';

@Module({
  controllers: [AdminController],
  providers: [AdminService, MailService],
  imports: [
    TypeOrmModule.forFeature([User, Invite]),
    UserModule,
    JwtModule.registerAsync(authConfig.asProvider())
  ],
  exports: [AdminService]
})
export class AdminModule { }


