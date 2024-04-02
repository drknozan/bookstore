import {
  Body,
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users/:username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.userService.getUserByUsername(username);
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch('/users/profile/update-email')
  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 500, description: 'INTERNAL_ERROR' })
  async updateEmail(
    @Body() updateEmailDto: UpdateEmailDto,
    @Request() req,
  ): Promise<{ message: string }> {
    const { user } = req.user;
    const message = await this.userService.updateEmail(updateEmailDto, user);

    return message;
  }

  @UseGuards(AuthGuard)
  @Patch('/users/profile/update-password')
  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 500, description: 'INTERNAL_ERROR' })
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Request() req,
  ): Promise<{ message: string }> {
    const { user } = req.user;
    const message = await this.userService.updatePassword(
      updatePasswordDto,
      user,
    );

    return message;
  }

  @MessagePattern({ cmd: 'create_user' })
  async createUser(
    @Ctx() context: RmqContext,
    @Payload() registerUser: RegisterDto,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);

    const createdUser = await this.userService.createUser(registerUser);
    return createdUser;
  }

  @MessagePattern({ cmd: 'validate_user' })
  async validateUser(
    @Ctx() context: RmqContext,
    @Payload() validateUser: LoginDto,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);

    const user = await this.userService.validateUser(validateUser);
    return user;
  }
}
