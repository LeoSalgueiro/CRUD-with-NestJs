import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { InicioSesion } from './models/InicioSesion.model';
import { PerfilUsuario } from './models/PerfilUsuario.model';
import { Domicilio } from './models/Domicilio.model';
import { UsersController } from './users.controller';

@Module({
  imports:[SequelizeModule.forFeature([InicioSesion, PerfilUsuario, Domicilio])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
