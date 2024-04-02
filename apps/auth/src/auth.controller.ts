import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 500, description: 'INTERNAL_ERROR' })
  @ApiResponse({ status: 201, description: 'CREATED' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() newUser: RegisterDto) {
    try {
      const createdUser = await this.authService.register(newUser);
      return createdUser;
    } catch (error) {
      throw new HttpException(error.message, error.code || 500);
    }
  }

  @Post('login')
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  @ApiResponse({ status: 500, description: 'INTERNAL_ERROR' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginUser: LoginDto) {
    try {
      const user = await this.authService.login(loginUser);
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.code || 500);
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  getProfile(@Request() req) {
    return req.user;
  }

  @MessagePattern({ cmd: 'verify_token' })
  async validateToken(
    @Ctx() context: RmqContext,
    @Payload() payload: { token: string },
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);

    const user = await this.authService.verifyToken(payload.token);
    return user;
  }
}
