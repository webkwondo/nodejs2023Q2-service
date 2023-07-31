import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({ example: 'The Show Must Go On', description: 'Track title' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'UUID, refers to Artist' })
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  readonly artistId: string | null;

  @ApiProperty({ description: 'UUID, refers to Album' })
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  readonly albumId: string | null;

  @ApiProperty({ example: 262, description: 'Duration in seconds, integer' })
  @IsInt()
  @IsNotEmpty()
  readonly duration: number;
}
