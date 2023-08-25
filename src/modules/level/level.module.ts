import { UtilService } from './../util/util.service';
import { HistoricAttendanceService } from './../historic-attendance/historic-attendance.service';
import { PrismaService } from './../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { AttendancesService } from '../attendances/attendances.service';
import { AttendanceRuleService } from '../attendance-rule/attendance-rule.service';
import { ExcelService } from '../excel/excel.service';

@Module({
  controllers: [LevelController],
  providers: [LevelService, PrismaService, ExcelService, AttendancesService, HistoricAttendanceService, AttendanceRuleService, UtilService]
})
export class LevelModule { }
