import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Auth0Module } from 'src/auth0/auth0.module';
import { UserTransformer } from './user.transformer';

@Module({
  providers: [UserService, UserTransformer],
  controllers: [UserController],
  imports: [Auth0Module]
})
export class UserModule {}
