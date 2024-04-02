import { Body, Controller, Request, Post, UseGuards } from '@nestjs/common';
import { OfferService } from './offer.service';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferDto } from './dto/offer.dto';

@Controller()
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @UseGuards(AuthGuard)
  @Post('/offers/create')
  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  @ApiResponse({ status: 500, description: 'INTERNAL_ERROR' })
  @ApiResponse({ status: 201, description: 'CREATED' })
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @Request() req,
  ): Promise<OfferDto> {
    const { user } = req.user;

    const createdBook = await this.offerService.createOffer(
      createOfferDto,
      user,
    );

    return createdBook;
  }
}
