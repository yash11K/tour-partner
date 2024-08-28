import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { TokenService } from 'src/auth0/auth0.token.service';
import { Auth0Service } from 'src/auth0/auth0.service';
import { Auth0Module } from 'src/auth0/auth0.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ApiController],
  providers: [ApiService, TokenService, Auth0Service],
  imports: [
    Auth0Module,
    HttpModule,
  ],
})
export class ApiModule {}
