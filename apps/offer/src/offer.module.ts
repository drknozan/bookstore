import { Module } from '@nestjs/common';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/offer/.env',
    }),
    DatabaseModule,
  ],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
