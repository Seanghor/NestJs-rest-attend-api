import { LevelModule } from './modules/level/level.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AttendancesModule } from './modules/attendances/attendances.module';
import { PrismaModule } from './prisma/prisma.module';
import { AttendanceRuleModule } from './modules/attendance-rule/attendance-rule.module';
import { HistoricAttendanceModule } from './modules/historic-attendance/historic-attendance.module';
import { LocationModule } from './modules/location/location.module';
import { ExcelModule } from './modules/excel/excel.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './modules/admins/admins.module';
import { UtilModule } from './modules/util/util.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AttendancesModule,
    AttendanceRuleModule,
    HistoricAttendanceModule,
    LocationModule,
    ExcelModule,
    AuthModule,
    AdminsModule,
    SuperAdminModule,
    UtilModule,
    LevelModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
