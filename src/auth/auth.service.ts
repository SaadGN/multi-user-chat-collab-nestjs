import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import authConfig from '../config/auth.config';
import type { ConfigType } from '@nestjs/config';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invite } from 'src/admin/invite/entity/invite.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
    constructor(

        private readonly userService: UserService,
        private readonly jwtService: JwtService,

        @Inject(authConfig.KEY)
        private readonly authConfiguration: ConfigType<typeof authConfig>,

        @InjectRepository(Invite)
        private inviteRepository: Repository<Invite>

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

    async signup(token: string, userDto: CreateUserDto) {
        try {
            const tokenExist = await this.inviteRepository.findOne({
                where: { token }
            })
            if (!tokenExist) {
                throw new BadRequestException('Invalid token!')
            }

            if (tokenExist.email !== userDto.email) {
                throw new BadRequestException(`User with email ${userDto.email} is not invited!`)
            }

            await this.userService.createUser(userDto)


            return {
                success: true,
                message: "User created successfully!"
            }
        } catch (error) {
            throw error
        }
    }
}
