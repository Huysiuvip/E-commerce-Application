import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationEnv } from './configs/env.validation';
import { PinoLoggerModule } from './configs/logger/logger.module';
import { AppThrottlerModule } from './configs/throttler/throttler.module';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CorrelationIdMiddleware } from './core/middlewares/correlation-id.middleware';
import { AllExceptionsFilter } from './core/filters/all-exceptions.filter';
import appConfig from './configs/app/app.config';
import throttlerConfig from './configs/throttler/throttler.config';

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
      load: [appConfig, throttlerConfig],
    }),
    PinoLoggerModule,
    AppThrottlerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
