import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RpcException } from '@nestjs/microservices';

describe('UserService', () => {
  let userService: UserService;

  const mockUserRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create new user', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      username: 'testuser',
      password: 'testpassword',
    };

    const mockUserWithoutPass = {
      id: mockUser.id,
      email: mockUser.email,
      username: mockUser.username,
    };

    jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(false);
    jest.spyOn(mockUserRepository, 'save').mockResolvedValue(mockUser);

    const createdUser = await userService.createUser({
      email: mockUser.email,
      username: mockUser.username,
      password: mockUser.password,
    });

    expect(mockUserRepository.findOneBy).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(createdUser).toEqual(mockUserWithoutPass);
    expect(createdUser).not.toHaveProperty('password');
  });

  it('should throw error if email or username already exists when creating new user', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      username: 'testuser',
      password: 'testpassword',
    };

    jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(true);

    expect(mockUserRepository.findOneBy).toHaveBeenCalled();

    await expect(
      userService.createUser({
        email: mockUser.email,
        username: mockUser.username,
        password: mockUser.password,
      }),
    ).rejects.toThrow(
      new RpcException({ code: 400, message: 'Email already exists' }),
    );
  });

  it('should throw error when email or password is wrong', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      username: 'testuser',
      password: 'testpassword',
    };

    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(false);

    await expect(
      userService.validateUser({
        email: mockUser.email,
        password: mockUser.password,
      }),
    ).rejects.toThrow(
      new RpcException({ code: 400, message: 'Email or password is wrong' }),
    );
  });

  it('should find user by username', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      username: 'testuser',
    };

    jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(mockUser);

    const user = await userService.getUserByUsername(mockUser.username);

    expect(mockUserRepository.findOneBy).toHaveBeenCalled();
    expect(user).toEqual(mockUser);
  });
});
