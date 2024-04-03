import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { IUser } from './interfaces/user.interface';
import { OfferDto } from './dto/offer.dto';
import { offerMapper } from './mappers/offer.mapper';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    @Inject('BOOK_SERVICE') private readonly bookClient: ClientProxy,
  ) {}

  async createOffer(
    createOfferDto: CreateOfferDto,
    user: IUser,
  ): Promise<OfferDto> {
    const { bookSlug, amount } = createOfferDto;
    const { username } = user;

    const offer = { username, bookSlug, amount };

    const offerExists = await this.offerRepository.findOne({
      where: { bookSlug, username },
    });

    if (offerExists) {
      throw new ConflictException('Offer already exists');
    }

    const createdOffer = await this.offerRepository.save(offer);

    return offerMapper(createdOffer);
  }

  async getUserOffers(user: IUser): Promise<OfferDto[]> {
    const { username } = user;

    const offers = await this.offerRepository.findBy({ username });

    return offers.map((offer) => offerMapper(offer));
  }

  async getBookOffers({
    slug,
    user,
  }: {
    slug: string;
    user: IUser;
  }): Promise<OfferDto[]> {
    const { username } = user;

    await lastValueFrom(
      this.bookClient.send({ cmd: 'check_book_owner' }, { slug, username }),
    );

    const offers = await this.offerRepository.findBy({ bookSlug: slug });
    return offers.map((offer) => offerMapper(offer));
  }
}
