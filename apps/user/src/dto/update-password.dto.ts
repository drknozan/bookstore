import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'testpassword' })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password is too short' })
  @MaxLength(24, { message: 'Password is too long' })
  @IsString()
  password: string;
}
