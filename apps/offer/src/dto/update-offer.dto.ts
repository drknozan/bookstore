import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateOfferDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(220, { message: 'Book slug is too long' })
  @IsString()
  bookSlug: string;

  @ApiProperty()
  @IsNotEmpty()
  @Max(500000)
  @Min(0)
  @IsInt()
  amount: number;
}
