import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ example: 'Innuendo', description: 'Album title' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 1991, description: 'Year' })
  @IsInt()
  @IsNotEmpty()
  readonly year: number;

  @ApiProperty({ description: 'UUID, refers to Artist' })
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  readonly artistId: string | null;
}
