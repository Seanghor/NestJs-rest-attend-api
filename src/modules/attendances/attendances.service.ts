import { Injectable, UseFilters } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceDto } from './dto/attendance.dto';
import { HistoricAttendanceService } from '../historic-attendance/historic-attendance.service';
import * as moment from 'moment';
import { AttendanceRuleService } from '../attendance-rule/attendance-rule.service';
import { UtilService } from '../util/util.service';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { log } from 'console';
import { AttendanceStatusEnum, CheckOutStatusEnum } from '@prisma/client';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class AttendancesService {
  constructor(
    private prisma: PrismaService,
    private hist: HistoricAttendanceService,
    private attendanceRule: AttendanceRuleService,
    private util: UtilService,
  ) { }

  async create(attendance: AttendanceDto) {
    const students = await this.prisma.users.findMany();
    // check for mark Absent:
    for (const student of students) {
      const exist = await this.hist.findAllByDateAndId(
        attendance.date,
        student.id,
      );
      // create hist-attedance absent student(every students)
      if (!exist) {
        await this.hist.markAbsentAttendance(
          attendance.date,
          student.id,
          student.level,
          student.name,
        );
      }
    }

    // create att
    const res = await this.prisma.attendances.create({
      data: { ...attendance },
    });
    const attRule = await this.attendanceRule.findAll();
    const timeIn = attRule[0].onDutyTime; // first element of array
    const timeOut = attRule[0].offDutyTime;
    const filter = await this.findAllByDateAndUserId(
      attendance.date,
      attendance.userId,
    );
    console.log("----------------------");
    console.log("timeIn: ", timeIn);
    console.log("student checkinAt:", attendance.time);
    console.log(attendance.time.localeCompare(timeIn));

    //  ---quick note
    // checkInTime == onDutyTime :--> 0 onTime
    // checkInTime < onDutyTime :--> -1 Early
    // checkInTime > onDutyTime :--> 1 Late

    // when first time scan of the day, check if checkIn Early
    if (filter.length == 0 && attendance.time.localeCompare(timeIn) === -1) {
      const user = await this.prisma.users.findUnique({
        where: { id: attendance.userId },
      });
      const message = `${user.name} has checked into school at ${attendance.time}`;
      await this.util.sendTelegramCheckInMessage(user.fatherChatId, message);
    }

    // scan second time
    if (filter.length > 1) {
      const user = await this.prisma.users.findUnique({
        where: { id: attendance.userId },
      });
      const message = `${user.name} has checked out of school at ${attendance.time}`;
      await this.util.sendTelegramCheckOutMessage(user.fatherChatId, message);
    }
    await this.calculateAttendance(attendance.date, attendance.userId);
    return res;
  }

  async findAll() {
    return this.prisma.attendances.findMany();
  }

  async findAllByUserId(userId: string) {
    return await this.prisma.attendances.findMany({ where: { userId } });
  }

  async findAllByDate(date: string) {
    return await this.prisma.attendances.findMany({ where: { date } });
  }

  async findAllByDateAndUserId(date: string, userId: string) {
    const res = await this.prisma.attendances.findMany({
      where: { AND: [{ date: date }, { userId: userId }] },
    });
    return res;
  }

  async calculateAttendance(date: string, userId: string) {
    const filter = await this.findAllByDateAndUserId(date, userId);

    const checkIn = filter[0].time;  //firstime scan: checkIn
    const checkOut = filter[filter.length - 1].time; //checkOut

    const rule = await this.prisma.attendanceRule.findMany();

    const onDuty = rule[0].onDutyTime;
    const lateMinute = rule[0].lateMinute;

    const offDuty = rule[0].offDutyTime;

    const time1 = moment(checkIn, 'HH:mm'); //firstime scan: checkIn
    const time2 = moment(onDuty, 'HH:mm').add(lateMinute, 'minutes'); //onDuty + lateMinute

    const diff = time2.diff(time1, 'minutes'); //different between time1 and time2

    let onStats: AttendanceStatusEnum;
    if (filter.length >= 1) {
      if (time1 < time2 || diff === 0) {  //example latemin=5, onDuti=7:00: --> if u checkin at 7:00 or 7:05 --> Early
        onStats = AttendanceStatusEnum.Early;
      } else {
        onStats = AttendanceStatusEnum.Late;
      }
    } else {
      onStats = AttendanceStatusEnum.Absent;
    }

    const offTime1 = moment(checkOut, 'HH:mm'); //time checkout
    const offTime2 = moment(offDuty, 'HH:mm');  // time for end work

    let offStats: CheckOutStatusEnum;
    if (offTime1 < offTime2) {
      offStats = CheckOutStatusEnum.Leave_Early;
    } else {
      offStats = CheckOutStatusEnum.Leave_Early;
    }

    await this.prisma.users.update({
      where: { id: userId },
      data: { checkIn: checkIn, checkOut: checkOut },
    });
    if (filter.length > 1) { //scan 2rd time (checkout)
      await this.prisma.historicAtt.updateMany({
        where: { AND: [{ date: date }, { userId: userId }] },
        data: {
          checkIn: checkIn,
          checkOut: checkOut,
          attendanceStatus: onStats,
          checkOutStatus: offStats,
          temperature: filter[0].temperature,
        },
      });
    } else { //scan first time (checkIn)
      await this.prisma.historicAtt.updateMany({
        where: { AND: [{ date: date }, { userId: userId }] },
        data: {
          checkIn: checkIn,
          attendanceStatus: onStats,
          temperature: filter[0].temperature,
        },
      });
    }
    return filter;
  }

  async findAllByLevelAndDate(level: string, date: string) {
    return await this.prisma.attendances.findMany({
      where: { AND: [{ level }, { date }] },
    });
  }

  async findAllByLevel(level: string) {
    return await this.prisma.attendances.findMany({
      where: { level: level },
    });
  }

  async deleteOne(id: number) {
    return await this.prisma.attendances.delete({ where: { id } });
  }

  async findOneById(id: number) {
    return await this.prisma.attendances.findUnique({ where: { id } });
  }
}
