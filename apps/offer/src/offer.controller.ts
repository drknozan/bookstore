import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Param,
  HttpException,
} from '@nestjs/common';
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

  @UseGuards(AuthGuard)
  @Get('/offers/')
  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  @ApiResponse({ status: 500, description: 'INTERNAL_ERROR' })
  async getUserOffers(@Request() req): Promise<OfferDto[]> {
    const { user } = req.user;

    const offers = await this.offerService.getUserOffers(user);

    return offers;
  }

  @UseGuards(AuthGuard)
  @Get('/offers/:slug')
  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  @ApiResponse({ status: 500, description: 'INTERNAL_ERROR' })
  async getBookOffers(
    @Param('slug') slug: string,
    @Request() req,
  ): Promise<OfferDto[]> {
    const { user } = req.user;

    try {
      const offers = await this.offerService.getBookOffers({ slug, user });

      return offers;
    } catch (error) {
      throw new HttpException(error.message, error.code || 500);
    }
  }
}
