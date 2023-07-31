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
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { validate as uuidValidate } from 'uuid';
import {
  USER_INVALID_DATA_ERROR,
  USER_INVALID_ID_ERROR,
  USER_NOT_FOUND_ERROR,
  USER_NOT_FOUND_ID_ERROR,
} from './user.constants';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const data = plainToInstance(CreateUserDto, dto);
    const errors = await validate(data, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new BadRequestException(USER_INVALID_DATA_ERROR);
    }

    const dataAsPlain = instanceToPlain(data) as CreateUserDto;

    const createdUser = await this.userService.create(dataAsPlain);

    if (!createdUser) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }

    return new User({ ...createdUser });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    return (await this.userService.findAll()).map(
      (user) => new User({ ...user }),
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // try {
    const user = await this.userService.findOne(id);

    if (!uuidValidate(id)) {
      throw new BadRequestException(USER_INVALID_ID_ERROR);
    }

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ID_ERROR);
    }

    return new User({ ...user });
    // } catch (error) {
    // throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    // throw new HttpException(error.message, error.status);
    // }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePasswordDto) {
    try {
      if (!uuidValidate(id)) {
        throw new BadRequestException(USER_INVALID_ID_ERROR);
      }

      const data = plainToInstance(UpdatePasswordDto, dto);
      const errors = await validate(data, {
        whitelist: true,
        skipMissingProperties: false,
      });

      if (errors.length > 0) {
        throw new BadRequestException(USER_INVALID_DATA_ERROR);
      }

      const dataAsPlain = instanceToPlain(data) as UpdatePasswordDto;

      const updatedUser = await this.userService.update(id, dataAsPlain);

      if (!updatedUser) {
        throw new NotFoundException(USER_NOT_FOUND_ID_ERROR);
      }

      return new User({ ...updatedUser });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException(USER_INVALID_ID_ERROR);
    }

    const deletedUser = await this.userService.remove(id);

    if (!deletedUser) {
      throw new NotFoundException(USER_NOT_FOUND_ID_ERROR);
    }

    return null;
  }
}
