import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1')
  app.enableCors();

  //SwaggerUI
  const config = new DocumentBuilder()
  .setTitle('Tour Partner Portal')
  .setDescription('Engine for TourPartners')
  .setVersion('1.0')
  .addTag('actions')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(3001);
}
bootstrap();
