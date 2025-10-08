import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import authConfig from '../config/auth.config';
import type { ConfigType } from '@nestjs/config';


@Injectable()
export class AuthService {
    constructor(

        private readonly userService: UserService,
        private readonly jwtService: JwtService,

        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>

    ) { }

    async loginUser(loginDto: LoginDto) {
        const user = await this.userService.findUserByMail(loginDto.email)

        if (!user) {
            throw new NotFoundException('No User found!!!')
        }

        let isEqual = false

        isEqual = await bcrypt.compare(loginDto.password, user.password)

        if (!isEqual) {
            throw new UnauthorizedException('Incorrect password!!!')
        }

        const token = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role
        }, {
            secret: this.authConfiguration.secret,
            expiresIn: this.authConfiguration.expiresIn,
            issuer: this.authConfiguration.issuer,
            audience: this.authConfiguration.audience
        })


        return {
            message: "Login successfull",
            token: token
        }


    }
}
