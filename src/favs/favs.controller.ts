import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  BadRequestException,
  HttpCode,
  HttpException,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { ApiTags } from '@nestjs/swagger';
import { validate as uuidValidate } from 'uuid';
import { TRACK_INVALID_ID_ERROR } from 'src/track/track.constants';

@ApiTags('Favs')
@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  async findAll() {
    return await this.favsService.findAll();
  }

  @Post('/track/:id')
  @HttpCode(201)
  async addTrack(@Param('id') id: string) {
    try {
      if (!uuidValidate(id)) {
        throw new BadRequestException(TRACK_INVALID_ID_ERROR);
      }

      return await this.favsService.addTrack(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('/track/:id')
  @HttpCode(204)
  async removeTrack(@Param('id') id: string) {
    try {
      if (!uuidValidate(id)) {
        throw new BadRequestException(TRACK_INVALID_ID_ERROR);
      }

      return await this.favsService.removeTrack(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('/album/:id')
  @HttpCode(201)
  async addAlbum(@Param('id') id: string) {
    try {
      if (!uuidValidate(id)) {
        throw new BadRequestException(TRACK_INVALID_ID_ERROR);
      }

      return await this.favsService.addAlbum(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('/album/:id')
  @HttpCode(204)
  async removeAlbum(@Param('id') id: string) {
    try {
      if (!uuidValidate(id)) {
        throw new BadRequestException(TRACK_INVALID_ID_ERROR);
      }

      return await this.favsService.removeAlbum(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('/artist/:id')
  @HttpCode(201)
  async addArtist(@Param('id') id: string) {
    try {
      if (!uuidValidate(id)) {
        throw new BadRequestException(TRACK_INVALID_ID_ERROR);
      }

      return await this.favsService.addArtist(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  async removeArtist(@Param('id') id: string) {
    try {
      if (!uuidValidate(id)) {
        throw new BadRequestException(TRACK_INVALID_ID_ERROR);
      }

      return await this.favsService.removeArtist(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
