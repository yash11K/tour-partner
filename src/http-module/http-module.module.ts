import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TokenService } from 'src/auth0/auth0.token.service';

@Module({
  providers: [TokenService],
  imports: [HttpModule],
})
export class HttpModuleModule {}
