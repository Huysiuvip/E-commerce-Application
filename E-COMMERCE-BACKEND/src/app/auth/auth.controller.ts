import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { SessionAuthService } from './session-auth/session-auth.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { User } from '../user/entities/user.entity';
import { ResEx } from 'src/swagger/response-examples';

@ApiTags('Xác thực (Auth)')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly sessionAuth: SessionAuthService,
  ) {}

  private mapUserResponse(user: User) {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  private async sessionFromRequest(req: { headers: any }) {
    const ctx = await this.sessionAuth.resolveSessionContext(req.headers);

    if (!ctx) return null;

    return {
      user: this.mapUserResponse(ctx.user),
      session: {
        token: ctx.session.token,
        expiresAt: ctx.session.expiresAt,
      },
    };
  }

  @Get('verify-email')
  @ApiOperation({
    summary: 'Xác minh email qua token (query)',
    operationId: 'auth_verify_email',
  })
  @ApiOkResponse({
    description: 'Example response',
    schema: {
      example: ResEx.auth.verifyEmail,
    },
  })
  async verifyEmail(
    @Query('token') token: string,
    @Query('email') email: string,
  ) {
    return this.authService.verifyEmailCustom(token, email);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Lấy thông tin User',
    operationId: 'auth_get_me',
  })
  @ApiOkResponse({
    description: 'Example',
    schema: {
      example: ResEx.auth.me,
    },
  })
  @ApiBadRequestResponse({
    description: 'Example',
    schema: {
      example: ResEx.auth.verifyEmailBadRequest,
    },
  })
  @ApiNotFoundResponse({
    description: 'Example',
    schema: {
      example: ResEx.auth.verifyEmailNotFound,
    },
  })
  @ApiBearerAuth()
  async getCurrentUser(@Req() req: any) {
    const session = await this.sessionFromRequest(req);

    if (!session?.user) {
      return {
        success: false,
        authenticated: false,
        message: 'Not authenticated',
        user: null,
      };
    }
    const fullUser = await this.userService.getUser(session.user.id);
    return {
      success: true,
      authenticated: true,
      user: fullUser ? this.mapUserResponse(fullUser) : session.user,
    };
  }

  @ApiOperation({
    summary: 'Lấy session',
    operationId: 'auth_get_session',
  })
  @ApiOkResponse({
    description: 'Example',
    schema: {
      example: ResEx.auth.session,
    },
  })
  @ApiBearerAuth()
  @Get('session')
  async getSession(@Req() req: any) {
    const session = await this.sessionFromRequest(req);
    if (!session?.session) {
      return {
        success: false,
        authenticated: false,
      };
    }
    return {
      success: true,
      authenticated: true,
      session: {
        token: session.session.token,
        expiresAt: session.session.expiresAt,
      },
      user: session.user,
    };
  }

  @ApiOperation({
    summary: 'Kiểm tra đăng nhập',
    operationId: 'auth_get_check',
  })
  @ApiOkResponse({
    description: 'Example',
    schema: {
      example: ResEx.auth.check,
    },
  })
  @ApiBearerAuth()
  @Get('check')
  @HttpCode(HttpStatus.OK)
  async checkAuth(@Req() req: any) {
    const session = await this.sessionFromRequest(req);
    if (!session?.user) {
      return {
        authenticated: false,
        user: null,
      };
    }
  }
}
