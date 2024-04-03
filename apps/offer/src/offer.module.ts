import { Module } from '@nestjs/common';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/offer/.env',
    }),
    DatabaseModule,
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
        name: 'BOOK_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'book_queue',
        },
      },
    ]),
    TypeOrmModule.forFeature([Offer]),
  ],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
