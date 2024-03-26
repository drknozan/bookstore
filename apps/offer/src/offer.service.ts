import { Injectable } from '@nestjs/common';

@Injectable()
export class OfferService {
  getHello(): string {
    return 'Hello World!';
  }
}
