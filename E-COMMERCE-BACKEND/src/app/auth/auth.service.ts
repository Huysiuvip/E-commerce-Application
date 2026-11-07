import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Verification } from './entities/verification.entity';
import { PinoLogger } from 'nestjs-pino';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { apiBadRequest } from 'src/shared/helpers/api-i18n';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    private readonly logger: PinoLogger,
    private readonly userService: UserService,
  ) {}
  async verifyEmailCustom(token: string, email: string) {
    const record = await this.verificationRepository.findOne({
      where: { value: token },
    });

    if (!record) {
      this.logger.warn({ msg: 'auth.verify.tokenNotFound', email });
      apiBadRequest('errors.auth.verificationFailed');
      // throw new BadRequestException('Token xác minh không hợp lệ');
    }
    if (record.expiresAt.getTime() < Date.now()) {
      await this.verificationRepository.delete({ id: record.id });
      this.logger.warn({ msg: 'auth.verify.tokenExpired', email });
      apiBadRequest('errors.auth.tokenExpired');
      // throw new BadRequestException('Token xác minh đã hết hạn');
    }
    if (record.identifier.toLowerCase() !== email.toLowerCase()) {
      this.logger.warn({
        msg: 'auth.verify.emailMismatch',
        tokenEmail: record.identifier,
        providedEmail: email,
      });
      apiBadRequest('errors.auth.emailMismatch');
      // throw new BadRequestException('Email không khớp với token xác minh');
    }
    await this.userService.verifyEmail(email);
    await this.verificationRepository.delete({ id: record.id });

    this.logger.info({ msg: 'auth.email.verified', email });

    return {
      success: true,
      message: 'Xác thực email thành công',
      user: null,
    };
  }
}
