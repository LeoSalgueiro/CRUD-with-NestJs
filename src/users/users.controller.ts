import { Controller, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';

const saltos = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}



    @Post()
    async crearUsuario(@Request() req): Promise <any>{
        await this.userService.insertOne(saltos, req.body.usuario, req.body.contra)
        
        
    }

}
