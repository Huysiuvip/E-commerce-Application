import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationEnv } from './configs/env.validation';

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
  ],
})
export class AppModule {}
