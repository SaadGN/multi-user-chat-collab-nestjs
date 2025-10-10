import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AdminDecorator } from 'src/auth/decorators/admin.decorator';
import { AuthorizeGuard } from 'src/guards/authorize.guard';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthorizeGuard)
@AdminDecorator()
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
