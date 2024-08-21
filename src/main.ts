import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Auth0Interceptor } from './auth0/auth0.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1')

  app.enableCors();

  await app.listen(3001);
}
bootstrap();
