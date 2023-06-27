import * as config from 'config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const port = config.get('app.port');
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  logger.log(`app is up and running on port ${port}`);
}
bootstrap();
