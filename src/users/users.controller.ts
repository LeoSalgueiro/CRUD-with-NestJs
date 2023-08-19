import { Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
import { UsersService } from './users.service';

const saltos = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @Post()
    async createUser(@Request() req): Promise <any>{
        await this.userService.insertOne(saltos, req.body.usuario, req.body.contra)
        
    }


    @Get(':id')
    async obtainUser(@Param('id') id: number){
        return await this.userService.findOne(id)
    }


    @Delete(':id')
    async deleteUser(@Param('id') id: number){
        return await this.userService.deleteUserById(id)
    }


    @Put(':id')
    async updateUser(@Param('id') id: number, @Body() body: any){
        return await this.userService.updateUserById(id, body)
    }

}
