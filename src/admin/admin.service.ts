import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        private readonly userService: UserService,
    ) { }

    async createDefaultAdmin() {
        const email = process.env.ADMIN_EMAIL
        const username = process.env.ADMIN_USERNAME
        const password = process.env.ADMIN_PASSWORD
        if (!email || !username || !password) {
            console.log('Missing admin credentials');
            return;
        }

        const existingUser = await this.userRepository.findOne({
            where: { role: "ADMIN" }
        })

        if (existingUser) {
            console.log("ADMIN alreasy consists")
            return
        }

        await this.userService.createUser({
            username: username,
            email: email,
            password: password,
            role: "ADMIN"
        })

        console.log("Default Admin Created")
    }
}
