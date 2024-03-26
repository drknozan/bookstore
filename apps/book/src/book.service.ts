import { Injectable } from '@nestjs/common';

@Injectable()
export class BookService {
  getHello(): string {
    return 'Hello World!';
  }
}
