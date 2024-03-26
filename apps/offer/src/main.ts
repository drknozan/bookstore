import { NestFactory } from '@nestjs/core';
import { OfferModule } from './offer.module';

async function bootstrap() {
  const app = await NestFactory.create(OfferModule);
  await app.listen(3002);
}
bootstrap();
