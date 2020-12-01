import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
async function bootstrap() {
  const { port } = process.env.PORT || config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(port);
  logger.log(`Applicaiton listening on port ${port}`);
}
bootstrap();
