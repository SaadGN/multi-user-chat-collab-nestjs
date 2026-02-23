import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('login')
    async loginUser(@Body() loginDto: LoginDto) {
        return await this.authService.loginUser(loginDto)
    }

    @Post('signup')
    async signup(
        @Query('token') token: string,
        @Body() userDto: CreateUserDto
    ) {
        return await this.authService.signup(token,userDto )
    }
}
