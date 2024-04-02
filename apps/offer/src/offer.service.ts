import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { IUser } from './interfaces/user.interface';
import { OfferDto } from './dto/offer.dto';
import { offerMapper } from './mappers/offer.mapper';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
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
}
