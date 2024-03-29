import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/book/.env',
    }),
    DatabaseModule,
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
