import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/user/.env',
    }),
    DatabaseModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
