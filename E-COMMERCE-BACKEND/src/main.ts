import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { APP_CONFIG } from './config/app/app.config';
import { setupAPP } from './bootstrap/setup-app';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const config = app.get(ConfigService);
  const appCfg = config.getOrThrow<{ port: number }>(APP_CONFIG);
  const logger = app.get(Logger);

  setupAPP(app, logger, config);

  const port = appCfg.port;
  await app.listen(port);
  logger.log(`Application is running on port: http://localhost:${port}`);
}
void bootstrap().catch((error) => {
  console.error('Bootstrap failed', error);
  process.exit(1);
});
