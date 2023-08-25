import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthenticationController } from './authentication/authentication.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from './users/models/Address.model';
import { InitSession } from './users/models/InitSession.model';
import { PerfilUser } from './users/models/PerfilUser.model';

@Module({
  imports: [AuthenticationModule,
    SequelizeModule.forRoot({
      dialect: 'mssql',
      host: '0.0.0.0',
      username: 'sa',
      password: 'Leonel1995+-',
      database: 'SQLSession',
      models: [Address, InitSession, PerfilUser],
      synchronize: false,
      
    }),
],
  controllers: [AppController, AuthenticationController],
  providers: [AppService],
})
export class AppModule {}
