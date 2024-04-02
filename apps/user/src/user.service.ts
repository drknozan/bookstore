import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUserByUsername(username: string): Promise<User> {
    const userByUsername = await this.usersRepository.findOneBy({ username });

    if (!userByUsername) {
      throw new NotFoundException();
    }

    delete userByUsername.password;

    return userByUsername;
  }

  async validateUser(user: LoginDto): Promise<User> {
    const { email, password } = user;

    const userByEmail = await this.usersRepository.findOne({
      select: ['id', 'username', 'email', 'password'],
      where: { email },
    });

    if (!userByEmail) {
      throw new RpcException({
        code: 401,
        message: 'Email or password is wrong',
      });
    }

    const passwordMatched = await bcrypt.compare(
      password,
      userByEmail.password,
    );

    if (!passwordMatched) {
      throw new RpcException({
        code: 401,
        message: 'Email or password is wrong',
      });
    }

    delete userByEmail.password;

    return userByEmail;
  }

  async createUser(newUser: RegisterDto): Promise<User> {
    const { email, username, password } = newUser;

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

    const savedUser = await this.usersRepository.save({
      email,
      username,
      password: hashedPassword,
    });

    delete savedUser.password;
    return savedUser;
  }
}
