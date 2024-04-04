import { User } from '../entities/user.entity';

export const userMapper = (user: User) => ({
  username: user.username,
});
