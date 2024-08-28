import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule } from './auth';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { ApiModule } from './api/api.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Auth0Interceptor } from './auth0/auth0.interceptor';
import { Auth0Module } from './auth0/auth0.module';
import { HttpModuleInterceptor } from './http-module/http-module.interceptor';
import { HttpModule } from '@nestjs/axios';
import { TokenService } from './auth0/auth0.token.service';

@Module({
  controllers: [AppController],
  providers: [AppService, TokenService,
    {
      provide: APP_INTERCEPTOR,
      useClass: Auth0Interceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpModuleInterceptor,
    },
  ],
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), JwtAuthModule, SuperAdminModule, ApiModule, Auth0Module, HttpModule],
})
export class AppModule {
}
