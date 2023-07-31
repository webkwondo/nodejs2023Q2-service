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
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ApiTags } from '@nestjs/swagger';
import { validate as uuidValidate } from 'uuid';
import {
  TRACK_INVALID_DATA_ERROR,
  TRACK_INVALID_ID_ERROR,
  TRACK_NOT_FOUND_ERROR,
  TRACK_NOT_FOUND_ID_ERROR,
} from './track.constants';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Track } from './entities/track.entity';

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  async create(@Body() dto: CreateTrackDto) {
    const data = plainToInstance(CreateTrackDto, dto);
    const errors = await validate(data, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new BadRequestException(TRACK_INVALID_DATA_ERROR);
    }

    const createdTrack = await this.trackService.create(dto);

    if (!createdTrack) {
      throw new NotFoundException(TRACK_NOT_FOUND_ERROR);
    }

    return new Track({ ...createdTrack });
  }

  @Get()
  async findAll() {
    return (await this.trackService.findAll()).map(
      (track) => new Track({ ...track }),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // try {
    const track = await this.trackService.findOne(id);

    if (!uuidValidate(id)) {
      throw new BadRequestException(TRACK_INVALID_ID_ERROR);
    }

    if (!track) {
      throw new NotFoundException(TRACK_NOT_FOUND_ID_ERROR);
    }

    return new Track({ ...track });
    // } catch (error) {
    // throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    // throw new HttpException(error.message, error.status);
    // }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTrackDto) {
    try {
      if (!uuidValidate(id)) {
        throw new BadRequestException(TRACK_INVALID_ID_ERROR);
      }

      const data = plainToInstance(UpdateTrackDto, dto);
      const errors = await validate(data, {
        whitelist: true,
        skipMissingProperties: false,
      });

      if (errors.length > 0) {
        throw new BadRequestException(TRACK_INVALID_DATA_ERROR);
      }

      const updatedTrack = await this.trackService.update(id, dto);

      if (!updatedTrack) {
        throw new NotFoundException(TRACK_NOT_FOUND_ID_ERROR);
      }

      return new Track({ ...updatedTrack });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(TRACK_INVALID_ID_ERROR);
    }

    const deletedTrack = await this.trackService.remove(id);

    if (!deletedTrack) {
      throw new NotFoundException(TRACK_NOT_FOUND_ID_ERROR);
    }

    return null;
  }
}
