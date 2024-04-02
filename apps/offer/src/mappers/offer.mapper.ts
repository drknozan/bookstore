import { Offer } from '../entities/offer.entity';

export const offerMapper = (offer: Offer) => ({
  bookSlug: offer.bookSlug,
  username: offer.username,
  amount: offer.amount,
});
