import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { RpcException } from '@nestjs/microservices';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { userMapper } from './mappers/user.mapper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUserByUsername(username: string): Promise<UserDto> {
    const user = await this.usersRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException();
    }

    delete user.password;

    return userMapper(user);
  }

  async updateEmail(
    updateEmailDto: UpdateEmailDto,
    user,
  ): Promise<{ message: string }> {
    const { email } = updateEmailDto;

    if (email) {
      const user = await this.usersRepository.findOneBy({ email });

      if (user) {
        throw new BadRequestException('Email already exists');
      }
    }

    const updated = await this.usersRepository.update(
      { username: user.username },
      { email },
    );

    if (updated.affected !== 0) {
      return { message: 'Email updated' };
    } else {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    user,
  ): Promise<{ message: string }> {
    const { password } = updatePasswordDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const updated = await this.usersRepository.update(
      { username: user.username },
      { password: hashedPassword },
    );

    if (updated.affected !== 0) {
      return { message: 'Password updated' };
    } else {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async validateUser(loginDto: LoginDto): Promise<UserDto> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({
      select: ['username', 'email', 'password'],
      where: { email },
    });

    if (!user) {
      throw new RpcException({
        code: 401,
        message: 'Email or password is wrong',
      });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      throw new RpcException({
        code: 401,
        message: 'Email or password is wrong',
      });
    }

    delete user.password;

    return user;
  }

  async createUser(registerDto: RegisterDto): Promise<User> {
    const { email, username, password } = registerDto;

    const existingUserByEmail = await this.usersRepository.findOneBy({
      email,
    });

    const existingUserByUsername = await this.usersRepository.findOneBy({
      username,
    });

    if (existingUserByEmail) {
      throw new RpcException({ code: 400, message: 'Email already exists' });
    }

    if (existingUserByUsername) {
      throw new RpcException({
        code: 400,
        message: 'Username already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.save({
      email,
      username,
      password: hashedPassword,
    });

    delete user.password;

    return user;
  }
}
