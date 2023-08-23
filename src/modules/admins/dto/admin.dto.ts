import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class AdminDto {
  // @IsEnum(UserRole)
  // @ApiProperty()
  // role: UserRole;

  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  // @IsString()
  // @ApiProperty()
  // createBySuperAdminId: number;
}
