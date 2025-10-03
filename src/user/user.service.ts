import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepositry: Repository<User>

    ) { }


    public async getUsers() {
        return "List of all users"
    }
}
