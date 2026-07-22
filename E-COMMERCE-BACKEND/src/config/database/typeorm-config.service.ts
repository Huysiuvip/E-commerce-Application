import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DATABASE_CONFIG } from './database.config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbConfig =
      this.config.getOrThrow<TypeOrmModuleOptions>(DATABASE_CONFIG);

    const isDev = this.config.get('NODE_ENV') === 'development';

    return {
      ...dbConfig,
      autoLoadEntities: true,
      synchronize: false,
      logging: isDev ? ['error', 'warn', 'query'] : ['error'],
      migrationsRun: false,
      retryAttempts: 5, //thử kết nối lại 5 lần nếu bị lỗi
      retryDelay: 3000, // mỗi lần thử cách nhau 3s
      namingStrategy: new SnakeNamingStrategy(), // thư viện đổi tên bảng, cột ex: userId ==> user_id
    };
  }
}
