import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationEnv } from './configs/env.validation';
import { PinoLoggerModule } from './configs/logger/logger.module';
import { AppThrottlerModule } from './configs/throttler/throttler.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

const envFile =
  process.env.NODE_ENV === 'production'
    ? ['.env.prod', '.env']
    : ['.env.dev', '.env'];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validationEnv,
      envFilePath: envFile,
    }),
    PinoLoggerModule,
    AppThrottlerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
