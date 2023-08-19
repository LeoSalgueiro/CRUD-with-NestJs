import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthenticationController } from './authentication/authentication.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Domicilio } from './users/models/Domicilio.model';
import { InicioSesion } from './users/models/InicioSesion.model';
import { PerfilUsuario } from './users/models/PerfilUsuario.model';

@Module({
  imports: [AuthenticationModule,
    SequelizeModule.forRoot({
      dialect: 'mssql',
      host: '0.0.0.0',
      username: 'sa',
      password: 'Leonel1995+-',
      database: 'SQLSession',
      models: [Domicilio, InicioSesion, PerfilUsuario],
      synchronize: false,
      
    }),
],
  controllers: [AppController, AuthenticationController],
  providers: [AppService],
})
export class AppModule {}
