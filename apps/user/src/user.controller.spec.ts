import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RpcException } from '@nestjs/microservices';
import { AuthGuard } from './guards/auth.guard';

describe('UserController', () => {
  let userController: UserController;

  const mockUsersService = {
    createUser: jest.fn(),
    validateUser: jest.fn(),
    getUserByUsername: jest.fn(),
    updateEmail: jest.fn(),
    updatePassword: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(),
  };

  const mockAuthServiceClient = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUsersService },
        {
          provide: AuthGuard,
          useValue: mockAuthGuard,
        },
        {
          provide: 'AUTH_SERVICE',
          useValue: mockAuthServiceClient,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
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

    jest
      .spyOn(mockUsersService, 'createUser')
      .mockResolvedValue(mockUserWithoutPass);

    const createdUser = await userController.createUser(
      {
        getChannelRef: () => ({ ack: jest.fn() }),
        getMessage: () => 'message',
      } as any,
      {
        email: mockUser.email,
        username: mockUser.username,
        password: mockUser.password,
      },
    );

    expect(createdUser).toEqual(mockUserWithoutPass);
  });

  it('should throw error if email or username already exists when creating new user', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      username: 'testuser',
      password: 'testpassword',
    };

    jest.spyOn(mockUsersService, 'createUser').mockImplementation(() => {
      return Promise.reject(
        new RpcException({ code: 400, message: 'Email already exists' }),
      );
    });

    await expect(
      userController.createUser(
        {
          getChannelRef: () => ({ ack: jest.fn() }),
          getMessage: () => 'message',
        } as any,
        {
          email: mockUser.email,
          username: mockUser.username,
          password: mockUser.password,
        },
      ),
    ).rejects.toThrow(
      new RpcException({ code: 400, message: 'Email already exists' }),
    );
  });

  it('should validate given user', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      username: 'testuser',
      password: 'testpassword',
    };

    jest.spyOn(mockUsersService, 'validateUser').mockImplementation(() => {
      return Promise.resolve(mockUser);
    });

    const user = await userController.validateUser(
      {
        getChannelRef: () => ({ ack: jest.fn() }),
        getMessage: () => 'message',
      } as any,
      {
        email: mockUser.email,
        password: mockUser.password,
      },
    );
    expect(user).toEqual(mockUser);
  });

  it('should throw error when email or password is wrong', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      username: 'testuser',
      password: 'testpassword',
    };

    jest.spyOn(mockUsersService, 'validateUser').mockImplementation(() => {
      return Promise.reject(
        new RpcException({ code: 401, message: 'Email or password is wrong' }),
      );
    });

    await expect(
      userController.validateUser(
        {
          getChannelRef: () => ({ ack: jest.fn() }),
          getMessage: () => 'message',
        } as any,
        {
          email: mockUser.email,
          password: mockUser.password,
        },
      ),
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

    jest
      .spyOn(mockUsersService, 'getUserByUsername')
      .mockResolvedValue(mockUser);

    const user = await userController.getUserByUsername(mockUser.username);

    expect(mockUsersService.getUserByUsername).toHaveBeenCalled();
    expect(user).toEqual(mockUser);
  });

  it('should update email', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      username: 'testuser',
    };

    const newEmail = 'test1@test1.com';

    jest
      .spyOn(mockUsersService, 'updateEmail')
      .mockResolvedValue({ message: 'Email updated' });

    const { message } = await userController.updateEmail(
      { email: newEmail },
      { user: { username: mockUser.username } },
    );

    expect(mockUsersService.updateEmail).toHaveBeenCalled();
    expect(message).toEqual('Email updated');
  });

  it('should update password', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      username: 'testuser',
    };

    const newPassword = 'newPassword';

    jest
      .spyOn(mockUsersService, 'updatePassword')
      .mockResolvedValue({ message: 'Password updated' });

    const { message } = await userController.updatePassword(
      { password: newPassword },
      { user: { username: mockUser.username } },
    );

    expect(mockUsersService.updatePassword).toHaveBeenCalled();
    expect(message).toEqual('Password updated');
  });
});
