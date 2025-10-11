import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { Invite } from './invite/entity/invite.entity';
import { MailService } from './invite/mail/mail.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService,MailService],
  imports: [
    TypeOrmModule.forFeature([User, Invite]),
    UserModule,
  ],
  exports: [AdminService]
})
export class AdminModule { }


