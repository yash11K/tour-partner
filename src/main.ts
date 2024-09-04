import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminProfile, Profile } from './api/dto/response/Profile.Response';
import { SuperAdminProfile } from "./api/dto/response/SuperAdminProfile";
import { Branding } from './organization/organization.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //app.setGlobalPrefix('/api')
  app.enableCors();

  //SwaggerUI
  const config = new DocumentBuilder()
  .setTitle('Tour Partner Portal')
  .setDescription('Engine for TourPartners')
  .setVersion('1.0')
  .addTag('actions')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter token recieved on successfull login attempt',
      in: 'header',
    },
    'access-token',
  )
  .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [Profile, SuperAdminProfile, AdminProfile, Branding],
  });
  SwaggerModule.setup('swagger', app, document);

  await app.listen(8080);
}
bootstrap();
