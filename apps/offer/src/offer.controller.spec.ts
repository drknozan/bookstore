import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './guards/auth.guard';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';

describe('OfferController', () => {
  let offerController: OfferController;

  const mockOfferService = {
    createOffer: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(),
  };

  const mockAuthServiceClient = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferController],
      providers: [
        { provide: OfferService, useValue: mockOfferService },
        {
          provide: AuthGuard,
          useValue: mockAuthGuard,
        },
        {
          provide: 'AUTH_SERVICE',
          useValue: mockAuthServiceClient,
        },
      ],
    }).compile();

    offerController = module.get<OfferController>(OfferController);
  });

  it('should be defined', () => {
    expect(offerController).toBeDefined();
  });

  it('should create new offer', async () => {
    const mockOffer = {
      bookSlug: 'lTwkejX-l_iAV096c0CLK-book-name',
      username: 'testuser',
      amount: 50,
    };

    jest.spyOn(mockOfferService, 'createOffer').mockResolvedValue(mockOffer);

    const createdOffer = await offerController.createOffer(
      {
        bookSlug: mockOffer.bookSlug,
        amount: mockOffer.amount,
      },
      { user: { username: 'testuser' } },
    );

    expect(mockOfferService.createOffer).toHaveBeenCalled();
    expect(createdOffer).toEqual(mockOffer);
  });
});
