import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExcelService } from '../excel/excel.service';
import { LocationService } from '../location/location.service';
import { UtilService } from '../util/util.service';
import { HistoricAttendanceController } from './historic-attendance.controller';
import { HistoricAttendanceService } from './historic-attendance.service';
import { JwtService } from '@nestjs/jwt';
import { LevelService } from '../level/level.service';

@Module({
  controllers: [HistoricAttendanceController],
  providers: [
    HistoricAttendanceService,
    PrismaService,
    LocationService,
    ExcelService,
    UtilService,
    JwtService,
    LevelService
  ],
})
export class HistoricAttendanceModule {}
