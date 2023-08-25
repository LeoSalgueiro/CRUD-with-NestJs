import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { InitSession } from './models/InitSession.model';
import { PerfilUser } from './models/PerfilUser.model';
import { Address } from './models/Address.model';
import { UsersController } from './users.controller';

@Module({
  imports:[SequelizeModule.forFeature([InitSession, PerfilUser, Address])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
