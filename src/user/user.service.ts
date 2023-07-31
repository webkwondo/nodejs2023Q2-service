import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { USER_INVALID_OLD_PASSWORD_ERROR } from './user.constants';

@Injectable()
export class UserService {
  users: User[] = [
    {
      id: '02e4937d-d87c-452b-9da9-be83551e7cf8',
      login: 'Login 1',
      password: 'pwd123',
      version: 1,
      createdAt: 1690811130989,
      updatedAt: 1690811130989,
    },
    {
      id: '61ff7a7c-0e8e-445c-bd64-eb423d122a47',
      login: 'Login 2',
      password: 'pwd123',
      version: 1,
      createdAt: 1690811130989,
      updatedAt: 1690811130989,
    },
    {
      id: '213ca80b-9a43-4109-857b-fa40c4f8d506',
      login: 'Login 3',
      password: 'pwd123',
      version: 1,
      createdAt: 1690811130989,
      updatedAt: 1690811130989,
    },
    {
      id: '36ed528d-b344-41e6-a112-1d7396bf45ae',
      login: 'Login 4',
      password: 'pwd123',
      version: 1,
      createdAt: 1690811130989,
      updatedAt: 1690811130989,
    },
    {
      id: 'a7e11750-15bb-457a-849e-7fc70f34b1b8',
      login: 'Login 5',
      password: 'pwd123',
      version: 1,
      createdAt: 1690811130989,
      updatedAt: 1690811130989,
    },
  ];

  async create(dto: CreateUserDto) {
    const timestamp = Date.now();

    const userObj = {
      id: uuidv4(),
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...dto,
    };

    this.users.push(userObj);

    return userObj;
  }

  async findAll() {
    return [...this.users];
  }

  async findOne(id: string) {
    return this.users.find((user) => user.id === id);

    // if (user) {
    //   return new User({ ...user });
    // }
  }

  async update(id: string, dto: UpdatePasswordDto) {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex < 0) {
      return null;
    }

    const user = this.users[userIndex];

    if (user.password !== dto.oldPassword) {
      // Server should answer with status code 403 and corresponding message if oldPassword is wrong
      throw new ForbiddenException(USER_INVALID_OLD_PASSWORD_ERROR);
    }

    const timestamp = Date.now();
    const newVersion = user.version + 1;

    this.users[userIndex] = {
      ...user,
      password: dto.newPassword,
      version: newVersion,
      updatedAt: timestamp,
    };

    return { ...this.users[userIndex] };
  }

  async remove(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex < 0) {
      return null;
    }

    const user = this.users[userIndex];

    this.users.splice(userIndex, 1);

    return user;
  }
}
