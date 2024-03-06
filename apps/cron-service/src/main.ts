import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/configuration';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  const configService = app.get(ConfigService<ConfigType>)

  const port = configService.get("port", {infer: true})

  await app.listen(port);
}
bootstrap();
