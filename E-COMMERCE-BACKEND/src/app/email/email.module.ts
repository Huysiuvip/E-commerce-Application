import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { InternalEmailController } from './email.controller';

@Module({
  imports: [ConfigModule],
  controllers: [InternalEmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
