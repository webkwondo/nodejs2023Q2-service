import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'userlogin', description: 'User login' })
  @IsString()
  @IsNotEmpty()
  readonly login: string;

  @ApiProperty({ example: '12345', description: 'Password, minimal length 5' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  readonly password: string;
}
