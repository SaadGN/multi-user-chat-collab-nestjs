import { BadRequestException, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { userRole } from './enums/role.enum';
import { UpdateUserDto } from './dtos/update-user.dto';
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

    public async findUserByMail(email: string) {
        return await this.userRepository.findOne({
            where: { email }
        })
    }

    public async createUser(userDto: CreateUserDto) {
        try {

            if (userDto.role === userRole.ADMIN) {
                throw new BadRequestException('Cannot create manual ADMIN')
            }

            //          check is user with same existingUsername/email exist
            const existingUser = await this.userRepository.findOne({
                where: [{ username: userDto.username }, { email: userDto.email }]
            })
            if (existingUser) {
                throw new BadRequestException(`There is already a user with same email/existingUsername`)

            }

            //          create user
            let user = this.userRepository.create({
                ...userDto,
                role: userRole.MEMBER
            })

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
        if (user.role === userRole.ADMIN) {
            throw new BadRequestException('Cannot delete default ADMIN')
        }

        await this.userRepository.delete(id)
        return {
            message: `user with id ${id} deleted successfully`
        }
    }

    public async updateUser(id: number, updateUserDto: UpdateUserDto) {
        try {
            if(!updateUserDto.password && !updateUserDto.username){
                throw new BadRequestException(`No data entered!`)
            }
            const user = await this.userRepository.findOne({
                where: { id }
            })
            if (!user) {
                    throw new BadRequestException(`User with id ${id} not found!`)
                }

            //check if updated username matches other username
            if (updateUserDto.username) {
                const existingUsername = await this.userRepository.findOne({
                    where: { username: updateUserDto.username }
                })
                if (existingUsername && existingUsername.id !== id) {
                    throw new BadRequestException(`User with username ${updateUserDto.username} already exists!`)
                }
            }

            Object.assign(user,updateUserDto)

            await this.userRepository.save(user)
            return {
                success: true,
                message: "User updated successfully",
                data: user
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



}



