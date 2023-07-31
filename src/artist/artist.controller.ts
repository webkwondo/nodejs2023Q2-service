import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ApiTags } from '@nestjs/swagger';
import { validate as uuidValidate } from 'uuid';
import {
  ARTIST_INVALID_DATA_ERROR,
  ARTIST_INVALID_ID_ERROR,
  ARTIST_NOT_FOUND_ERROR,
  ARTIST_NOT_FOUND_ID_ERROR,
} from './artist.constants';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Artist } from './entities/artist.entity';

@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  async create(@Body() dto: CreateArtistDto) {
    const data = plainToInstance(CreateArtistDto, dto);
    const errors = await validate(data, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new BadRequestException(ARTIST_INVALID_DATA_ERROR);
    }

    const dataAsPlain = instanceToPlain(data) as CreateArtistDto;

    const createdArtist = await this.artistService.create(dataAsPlain);

    if (!createdArtist) {
      throw new NotFoundException(ARTIST_NOT_FOUND_ERROR);
    }

    return new Artist({ ...createdArtist });
  }

  @Get()
  async findAll() {
    return (await this.artistService.findAll()).map(
      (artist) => new Artist({ ...artist }),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // try {
    const artist = await this.artistService.findOne(id);

    if (!uuidValidate(id)) {
      throw new BadRequestException(ARTIST_INVALID_ID_ERROR);
    }

    if (!artist) {
      throw new NotFoundException(ARTIST_NOT_FOUND_ID_ERROR);
    }

    return new Artist({ ...artist });
    // } catch (error) {
    // throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    // throw new HttpException(error.message, error.status);
    // }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateArtistDto) {
    // try {
    if (!uuidValidate(id)) {
      throw new BadRequestException(ARTIST_INVALID_ID_ERROR);
    }

    const data = plainToInstance(UpdateArtistDto, dto);
    const errors = await validate(data, {
      whitelist: true,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new BadRequestException(ARTIST_INVALID_DATA_ERROR);
    }

    const dataAsPlain = instanceToPlain(data);

    const updatedArtist = await this.artistService.update(id, dataAsPlain);

    if (!updatedArtist) {
      throw new NotFoundException(ARTIST_NOT_FOUND_ID_ERROR);
    }

    return new Artist({ ...updatedArtist });
    // } catch (error) {
    //   throw new HttpException(error.message, error.status);
    // }
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(ARTIST_INVALID_ID_ERROR);
    }

    const deletedArtist = await this.artistService.remove(id);

    if (!deletedArtist) {
      throw new NotFoundException(ARTIST_NOT_FOUND_ID_ERROR);
    }

    return null;
  }
}
