import { Controller, Get } from '@nestjs/common';
import { OfferService } from './offer.service';

@Controller()
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Get()
  getHello(): string {
    return this.offerService.getHello();
  }
}
