import { AttendanceStatusEnum, CheckOutStatusEnum, HistoricAtt } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class HistoricEntity implements HistoricAtt {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  temperature: string;

  @ApiProperty()
  attendanceStatus: AttendanceStatusEnum;

  @ApiProperty()
  checkOutStatus: CheckOutStatusEnum;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  checkIn: string;

  @ApiProperty()
  checkOut: string;
}
