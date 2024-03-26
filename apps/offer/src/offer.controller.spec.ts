import { Test, TestingModule } from '@nestjs/testing';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';

describe('OfferController', () => {
  let offerController: OfferController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OfferController],
      providers: [OfferService],
    }).compile();

    offerController = app.get<OfferController>(OfferController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(offerController.getHello()).toBe('Hello World!');
    });
  });
});
