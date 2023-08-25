import { HistoricAttendanceController } from './../historic-attendance/historic-attendance.controller';
import { Module, forwardRef } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoricAttendanceService } from '../historic-attendance/historic-attendance.service';
import { LocationService } from '../location/location.service';
import { ExcelService } from '../excel/excel.service';
import { UtilService } from '../util/util.service';
import { AttendanceRuleService } from '../attendance-rule/attendance-rule.service';
import { LevelService } from '../level/level.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HistoricAttendanceModule } from '../historic-attendance/historic-attendance.module';
import { LocationModule } from '../location/location.module';
import { ExcelModule } from '../excel/excel.module';
import { UtilModule } from '../util/util.module';
import { AttendanceRuleModule } from '../attendance-rule/attendance-rule.module';
import { LevelModule } from '../level/level.module';

@Module({
  imports: [
    forwardRef(() => HistoricAttendanceModule),  // Import the module with forwardRef
  ],
  providers: [
    AttendancesService,
    AttendanceRuleService,
    PrismaService,
    HistoricAttendanceService,
    LocationService,
    ExcelService,
    UtilService,
    LocationService,
    LevelService
  ],

  controllers: [AttendancesController],
  exports: [AttendancesService],
})
export class AttendancesModule { }
