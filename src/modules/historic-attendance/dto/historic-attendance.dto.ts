import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatusEnum, CheckOutStatusEnum } from '@prisma/client';
import { IsInt, IsString } from 'class-validator';

export class HistoricAttDto {
  @IsString()
  @ApiProperty({ required: false })
  date: string;

  @IsString()
  @ApiProperty({ required: false })
  attendanceStatus: AttendanceStatusEnum;

  @IsString()
  @ApiProperty({ required: false })
  checkOutStatus: CheckOutStatusEnum ;

  @IsInt()
  @ApiProperty()
  userId: string;

  @IsString()
  @ApiProperty({ required: false })
  temperature: string;

  @IsString()
  @ApiProperty({ required: false })
  level: string;

  @IsString()
  @ApiProperty({ required: false })
  checkIn: string;

  @IsString()
  @ApiProperty({ required: false })
  checkOut: string;
}
