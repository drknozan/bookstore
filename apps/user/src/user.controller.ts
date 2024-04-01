import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('create_user')
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

  @MessagePattern('validate_user')
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
