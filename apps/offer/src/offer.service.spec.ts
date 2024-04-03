import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OfferService } from './offer.service';
import { Offer } from './entities/offer.entity';
import { ConflictException } from '@nestjs/common';

describe('OfferService', () => {
  let offerService: OfferService;

  const mockOfferRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findBy: jest.fn(),
  };

  const mockBookServiceClient = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfferService,
        { provide: getRepositoryToken(Offer), useValue: mockOfferRepository },
        {
          provide: 'BOOK_SERVICE',
          useValue: mockBookServiceClient,
        },
      ],
    }).compile();

    offerService = module.get<OfferService>(OfferService);
  });

  it('should be defined', () => {
    expect(offerService).toBeDefined();
  });

  it('should create new offer', async () => {
    const mockOffer = {
      id: '1',
      bookSlug: 'lTwkejX-l_iAV096c0CLK-book-name',
      username: 'testuser',
      amount: 50,
    };

    jest.spyOn(mockOfferRepository, 'findOne').mockResolvedValue(false);
    jest.spyOn(mockOfferRepository, 'save').mockResolvedValue(mockOffer);

    const createdOffer = await offerService.createOffer(
      {
        bookSlug: mockOffer.bookSlug,
        amount: mockOffer.amount,
      },
      { username: 'testuser' },
    );

    delete mockOffer.id;

    expect(mockOfferRepository.save).toHaveBeenCalled();
    expect(createdOffer).toEqual(mockOffer);
  });

  it('should throws error when create new offer if offer exists', async () => {
    const mockOffer = {
      id: '1',
      bookSlug: 'lTwkejX-l_iAV096c0CLK-book-name',
      username: 'testuser',
      amount: 50,
    };

    jest.spyOn(mockOfferRepository, 'findOne').mockResolvedValue(true);

    expect(mockOfferRepository.findOne).toHaveBeenCalled();
    await expect(
      offerService.createOffer(
        {
          bookSlug: mockOffer.bookSlug,
          amount: mockOffer.amount,
        },
        { username: 'testuser' },
      ),
    ).rejects.toThrow(new ConflictException('Offer already exists'));
  });

  it('should get user offers', async () => {
    const mockOffers = [
      {
        id: '1',
        bookSlug: 'lTwkejX-l_iAV096c0CLK-book-name',
        username: 'testuser',
        amount: 50,
      },
      {
        id: '2',
        bookSlug: 'lTwkejX-l_iAV096c0CLK-book-name',
        username: 'testuser',
        amount: 50,
      },
    ];

    jest.spyOn(mockOfferRepository, 'findBy').mockResolvedValue(mockOffers);

    const offers = await offerService.getUserOffers({
      username: 'testuser',
    });

    mockOffers.forEach((offer) => {
      delete offer.id;
    });

    expect(mockOfferRepository.findBy).toHaveBeenCalled();
    expect(offers).toEqual(mockOffers);
  });
});
