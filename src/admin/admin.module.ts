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

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    TypeOrmModule.forFeature([User, Invite]),
    UserModule,
    JwtModule.registerAsync(authConfig.asProvider()),
    MailModule
  ],
  exports: [AdminService]
})
export class AdminModule { }


