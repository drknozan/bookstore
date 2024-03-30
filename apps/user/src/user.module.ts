import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common';

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
