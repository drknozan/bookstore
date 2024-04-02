import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, MaxLength } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(200, { message: 'Book name is too long' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(5000, { message: 'Book description is too long' })
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @Max(2050)
  @IsInt()
  year: number;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(500, { message: 'Book author name is too long' })
  @IsString()
  author: string;

  @ApiProperty()
  @IsNotEmpty()
  @Max(50000)
  @IsInt()
  numberOfPages: number;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(50)
  @IsString()
  language: string;

  @ApiProperty()
  @IsNotEmpty()
  @Max(500000)
  @IsInt()
  price: number;
}
