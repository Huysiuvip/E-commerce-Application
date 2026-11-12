import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { internalSecretGuard } from 'src/core/guards/internal-secret-guard';
import { SendAuthEmailDto } from './dto/send-auth-email.dto';

@ApiExcludeController()
@Controller('internal/email')
@UseGuards(internalSecretGuard)
export class InternalEmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('verification')
  @HttpCode(HttpStatus.OK)
  async sendVerification(@Body() body: SendAuthEmailDto) {
    const sent = await this.emailService.sendVerificationEmail(
      body.to,
      body.name,
      body.url,
    );
    return { success: sent };
  }
  @Post('password-reset')
  @HttpCode(HttpStatus.OK)
  async sendPasswordReset(@Body() body: SendAuthEmailDto) {
    const sent = await this.emailService.sendPasswordResetEmail(
      body.to,
      body.name,
      body.url,
    );
    return { success: sent };
  }
}
