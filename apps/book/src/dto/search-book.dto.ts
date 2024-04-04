import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class SearchBookDto {
  @ApiProperty()
  @IsOptional()
  @MaxLength(200)
  @IsString()
  @IsAlphanumeric()
  query: string;

  @ApiProperty()
  @IsOptional()
  @Max(1000)
  @IsInt()
  @Min(0)
  @Type(() => Number)
  page: number;

  @ApiProperty()
  @IsOptional()
  @Max(1000)
  @IsInt()
  @Min(0)
  @Type(() => Number)
  limit: number;
}
