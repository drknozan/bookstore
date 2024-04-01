import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'testpassword' })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password is too short' })
  @MaxLength(24, { message: 'Password is too long' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'testuser' })
  @IsNotEmpty()
  @MaxLength(20, { message: 'Username is too long' })
  @IsString()
  @IsAlphanumeric()
  username: string;
}
