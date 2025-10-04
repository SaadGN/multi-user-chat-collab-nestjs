import { Body, Controller, Delete, Get ,Param,ParseIntPipe,Post ,} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService:UserService){}

    @Get('')
    getUsers(){
        return this.userService.getUsers()
    }

    @Post('')
    createUser(@Body() userDto:CreateUserDto){
        return this.userService.createUser(userDto)
    }

    @Delete(':id')
    deleteUser(@Param('id',ParseIntPipe) id:number){
        return this.userService.deleteUser(id)
    }

}
