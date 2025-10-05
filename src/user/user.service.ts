import { BadRequestException, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>

    ) { }

    public async getUsers() {
        try {
            return await this.userRepository.find()
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new RequestTimeoutException("Error has occured.Try again later", {
                    description: 'Could not connect to database!'
                })
            }
            console.log(error)
        }
    }

    public async createUser(userDto: CreateUserDto) {
        try {

            //          check is user with same username/gmail exist
            const existingUser = await this.userRepository.findOne({
                where: [{ username: userDto.username }, { email: userDto.email }]
            })
            if (existingUser) {
                throw new BadRequestException(`There is already a user with same email/username`)

            }

            //          create user
            let user = this.userRepository.create(userDto)

            //          save user
            await this.userRepository.save(user)

            return {
                message: "User created succesfully!!!"
            }



        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new RequestTimeoutException("Error has occured.Try again later", {
                    description: 'Could not connect to database!'
                })
            }
            throw error
        }
    }

    public async deleteUser(id: number) {
        const user = await this.userRepository.findOne({
            where: { id }
        })
        if (!user) {
            throw new NotFoundException("no user found")
        }

        await this.userRepository.delete(id)
        return {
            message: `user with id ${id} deleted successfully`
        }
    }

}
