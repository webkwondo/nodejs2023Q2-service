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
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ApiTags } from '@nestjs/swagger';
import { validate as uuidValidate } from 'uuid';
import {
  ALBUM_INVALID_DATA_ERROR,
  ALBUM_INVALID_ID_ERROR,
  ALBUM_NOT_FOUND_ERROR,
  ALBUM_NOT_FOUND_ID_ERROR,
} from './album.constants';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Album } from './entities/album.entity';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  async create(@Body() dto: CreateAlbumDto) {
    const data = plainToInstance(CreateAlbumDto, dto);
    const errors = await validate(data, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new BadRequestException(ALBUM_INVALID_DATA_ERROR);
    }

    const dataAsPlain = instanceToPlain(data) as CreateAlbumDto;

    const createdAlbum = await this.albumService.create(dataAsPlain);

    if (!createdAlbum) {
      throw new NotFoundException(ALBUM_NOT_FOUND_ERROR);
    }

    return new Album({ ...createdAlbum });
  }

  @Get()
  async findAll() {
    return (await this.albumService.findAll()).map(
      (album) => new Album({ ...album }),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // try {
    const album = await this.albumService.findOne(id);

    if (!uuidValidate(id)) {
      throw new BadRequestException(ALBUM_INVALID_ID_ERROR);
    }

    if (!album) {
      throw new NotFoundException(ALBUM_NOT_FOUND_ID_ERROR);
    }

    return new Album({ ...album });
    // } catch (error) {
    // throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    // throw new HttpException(error.message, error.status);
    // }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAlbumDto) {
    // try {
    if (!uuidValidate(id)) {
      throw new BadRequestException(ALBUM_INVALID_ID_ERROR);
    }

    const data = plainToInstance(UpdateAlbumDto, dto);
    const errors = await validate(data, {
      whitelist: true,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new BadRequestException(ALBUM_INVALID_DATA_ERROR);
    }

    const dataAsPlain = instanceToPlain(data);

    const updatedAlbum = await this.albumService.update(id, dataAsPlain);

    if (!updatedAlbum) {
      throw new NotFoundException(ALBUM_NOT_FOUND_ID_ERROR);
    }

    return new Album({ ...updatedAlbum });
    // } catch (error) {
    //   throw new HttpException(error.message, error.status);
    // }
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(ALBUM_INVALID_ID_ERROR);
    }

    const deletedAlbum = await this.albumService.remove(id);

    if (!deletedAlbum) {
      throw new NotFoundException(ALBUM_NOT_FOUND_ID_ERROR);
    }

    return null;
  }
}
