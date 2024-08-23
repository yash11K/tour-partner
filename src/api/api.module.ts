import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { TokenService } from 'src/auth0/auth0.token.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ApiController],
  providers: [ApiService, TokenService],
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
})
export class ApiModule {}
