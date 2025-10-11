import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import authConfig from 'src/config/auth.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports:[UserService],
  imports:[
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(authConfig.asProvider()),
    ConfigModule.forFeature(authConfig)
  ]
})
export class UserModule {}
