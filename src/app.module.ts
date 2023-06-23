import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthenticationController } from './authentication/authentication.controller';

@Module({
  imports: [AuthenticationModule],
  controllers: [AppController, AuthenticationController],
  providers: [AppService],
})
export class AppModule {}
