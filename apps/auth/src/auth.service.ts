import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;

    const createdUser = await lastValueFrom(
      this.userClient.send(
        { cmd: 'create_user' },
        { email, username, password },
      ),
    );

    return createdUser;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await lastValueFrom(
      this.userClient.send({ cmd: 'validate_user' }, { email, password }),
    );

    const token = await this.jwtService.signAsync({
      user: { username: user.username },
    });

    return { token, user };
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      throw new RpcException({
        code: 401,
        message: 'Unauthorized',
      });
    }
  }
}
