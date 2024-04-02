import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async register(registerUser: RegisterDto) {
    const createdUser = await lastValueFrom(
      this.userClient.send({ cmd: 'create_user' }, registerUser),
    );

    return createdUser;
  }

  async login(loginUser: LoginDto) {
    const user = await lastValueFrom(
      this.userClient.send({ cmd: 'validate_user' }, loginUser),
    );

    const token = await this.jwtService.signAsync({
      user: { username: user.username },
    });

    return { token, user: { username: user.username } };
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
