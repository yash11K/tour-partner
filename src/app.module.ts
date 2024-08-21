import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthModule } from './auth';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { UserModule } from './user/user.module';
import { Auth0Module } from './auth0/auth0.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Auth0Interceptor } from './auth0/auth0.interceptor';
import { HttpModule } from '@nestjs/axios';
import { ApiModule } from './api/api.module';
import { TokenService } from './auth0/auth0.token.service';

@Module({
  controllers: [AppController],

  providers: [
    AppService, 
    {
      provide: APP_INTERCEPTOR,
      useClass: Auth0Interceptor
    }],

  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
  }), 
  HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
  JwtAuthModule, SuperAdminModule, UserModule, Auth0Module, ApiModule],
})

export class AppModule {}
