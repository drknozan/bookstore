import { NestFactory } from '@nestjs/core';
import { BookModule } from './book.module';

async function bootstrap() {
  const app = await NestFactory.create(BookModule);
  await app.listen(3001);
}
bootstrap();
