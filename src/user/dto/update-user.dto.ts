// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

// export class UpdatePasswordDto extends PartialType(CreateUserDto) {
export class UpdatePasswordDto {
  @ApiProperty({ example: 'oldpassword123', description: 'Old password' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: 'newpassword567', description: 'New password' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
