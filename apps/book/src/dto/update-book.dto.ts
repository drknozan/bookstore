import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, MaxLength } from 'class-validator';

export class UpdateBookDto {
  @ApiProperty()
  @IsOptional()
  @MaxLength(200, { message: 'Book name is too long' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(5000, { message: 'Book description is too long' })
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @Max(2050)
  @IsInt()
  year: number;

  @ApiProperty()
  @IsOptional()
  @MaxLength(500, { message: 'Book author name is too long' })
  @IsString()
  author: string;

  @ApiProperty()
  @IsOptional()
  @Max(50000)
  @IsInt()
  numberOfPages: number;

  @ApiProperty()
  @IsOptional()
  @MaxLength(50)
  @IsString()
  language: string;

  @ApiProperty()
  @IsOptional()
  @Max(500000)
  @IsInt()
  price: number;
}
