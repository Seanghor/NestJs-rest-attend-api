import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExcelService } from '../excel/excel.service';
import { LocationService } from '../location/location.service';
import { UtilService } from '../util/util.service';
import { HistoricAttendanceController } from './historic-attendance.controller';
import { HistoricAttendanceService } from './historic-attendance.service';
import { JwtService } from '@nestjs/jwt';
import { LevelService } from '../level/level.service';
import { AttendancesService } from '../attendances/attendances.service';
import { AttendanceRuleService } from '../attendance-rule/attendance-rule.service';
import { AttendanceRuleModule } from '../attendance-rule/attendance-rule.module';
import { AttendancesModule } from '../attendances/attendances.module';

@Module({
  imports: [
    forwardRef(() => AttendancesModule),  // Import the module with forwardRef
  ],
  controllers: [HistoricAttendanceController],
  providers: [
    HistoricAttendanceService,
    PrismaService,
    LocationService,
    ExcelService,
    UtilService,
    JwtService,
    LevelService,
    AttendanceRuleService,
    AttendancesService
  ],
  
})
export class HistoricAttendanceModule { }
