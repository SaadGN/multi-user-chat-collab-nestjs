import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get('')
    getUsers() {
        return this.userService.getUsers()
    }

    @Post('')
    createUser(@Body() userDto: CreateUserDto) {
        return this.userService.createUser(userDto)
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUser(id)
    }

    @Patch(':id')
    updateUser(
        @Param('id',ParseIntPipe) id:number,
        @Body() updateUserDto : UpdateUserDto
    ){
        return this.userService.updateUser(id,updateUserDto)
    }
}
