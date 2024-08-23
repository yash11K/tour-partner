import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule } from './auth';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { ApiModule } from './api/api.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), JwtAuthModule, SuperAdminModule, ApiModule],
})
export class AppModule {}
