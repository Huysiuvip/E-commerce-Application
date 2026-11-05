import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

export function setupSwagger(app: NestExpressApplication): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document);
}
