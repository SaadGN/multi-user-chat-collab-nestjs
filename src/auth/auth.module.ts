import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import authConfig from '../config/auth.config';
import { ConfigModule } from '@nestjs/config';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        UserModule,
        JwtModule.registerAsync(authConfig.asProvider()),
        ConfigModule.forFeature(authConfig)
    ],
    exports: [AuthService]
})
export class AuthModule { }
