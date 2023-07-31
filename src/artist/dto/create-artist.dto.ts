import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({ example: 'Freddie Mercury', description: 'Artist name' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: false, description: 'Did artist win Grammy?' })
  @IsBoolean()
  @IsNotEmpty()
  readonly grammy: boolean;
}
