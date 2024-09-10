import { Module } from '@nestjs/common';
import { Auth0Service } from './auth0.service';
import { HttpModule } from '@nestjs/axios';
import { TokenService } from './auth0.token.service';

@Module({
  providers: [Auth0Service, TokenService],
  exports: [Auth0Service],
  imports: [HttpModule],
})
export class Auth0Module {}
