import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { APP_CONFIG } from 'src/configs/app/app.config';

export function setupAPP(
  app: NestExpressApplication,
  logger: Logger,
  config: ConfigService,
) {
  app.use(cookieParser());
  //cors
  const appCfg = config.getOrThrow<{ corsOrigins: string[] }>(APP_CONFIG);
  const allowList = appCfg.corsOrigins;
  app.enableCors({
    origin: (requestOrigin: string, callback) => {
      if (!requestOrigin) {
        callback(null, true);
        return;
      }

      if (allowList.includes(requestOrigin)) {
        callback(null, true);
        return;
      }

      logger.warn(
        `CORS: blocked request from origin "${requestOrigin}" (not in allowList)`,
      );

      callback(null, false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Api versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableShutdownHooks();
}
