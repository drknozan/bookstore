import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisModule } from '@app/common/modules/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/book/.env',
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'auth_queue',
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'SEARCH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'search_queue',
        },
      },
    ]),
    DatabaseModule,
    TypeOrmModule.forFeature([Book]),
    RedisModule,
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
