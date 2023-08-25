import { BadRequestException, Inject, Injectable, UseFilters, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExcelService } from '../excel/excel.service';
import { LocationService } from '../location/location.service';
import { HistoricAttDto } from './dto/historic-attendance.dto';
import { AttendanceStatusEnum, CheckOutStatusEnum } from '@prisma/client';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { LevelService } from '../level/level.service';
import { AttendancesService } from '../attendances/attendances.service';


@Injectable()
@UseFilters(HttpExceptionFilter)
export class HistoricAttendanceService {
  constructor(
    private prisma: PrismaService,
    private readonly attendance: AttendancesService,
    private level: LevelService,
    private excel: ExcelService,

  ) { }

  async create(history: HistoricAttDto) {
    const uniqueData = await this.prisma.historicAtt.findUnique({
      where: { date_userId: { date: history.date, userId: history.userId } },
    });

    if (uniqueData) throw new BadRequestException('Data already exist with date and userId');
    const user = await this.prisma.users.findUnique({ where: { id: history.userId } })
    return await this.prisma.historicAtt.create({ data: { ...history, name: user.name } });
  }

  async findAll(page: number) {
    const total = await this.prisma.historicAtt.count();
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.historicAtt.findMany({
      take: 10,
      skip: 10 * (page - 1),
    });
    return {
      data: res,
      pagination: {
        totalData: total,
        totalPages: pages,
        dataPerPage: total / pages,
      },
    };
  }

  async findAllByUserId(id: string) {
    return await this.prisma.historicAtt.findMany({ where: { userId: id } });
  }

  async findOneByDateAndId(date: string, id: string) {
    return await this.prisma.historicAtt.findUnique({
      where: { date_userId: { date: date, userId: id } },
    });
  }
  async findAllByDateAndId(date: string, id: string) {
    return await this.prisma.historicAtt.findMany({
      where: { AND: [{ date: date }, { userId: id }] },
    });
  }

  async findAllByDate(date: string, page: number) {
    const total = await this.prisma.historicAtt.count({ where: { date } });
    const pages = Math.ceil(total / 10);
    const his = await this.prisma.historicAtt.findMany({
      where: { date },
      take: 10,
      skip: 10 * (page - 1),
    });
    return {
      data: his,
      pagination: {
        totalData: total,
        totalPages: pages,
        dataPerPage: total / pages,
      },
    };
  }

  async delete(id: number) {
    return await this.prisma.historicAtt.delete({ where: { id } });
  }

  async findAllByLevel(level: string) {
    return await this.prisma.historicAtt.findMany({
      where: { level: level },
    });
  }



  async markAbsentAttendance(
    date: string,
    userId: string,
    level: string,
    name: string,
  ) {
    return await this.prisma.historicAtt.create({
      data: {
        date: date,
        level: level,
        checkIn: '--:--',
        checkOut: '--:--',
        temperature: '0',
        attendanceStatus: AttendanceStatusEnum.Absent,
        checkOutStatus: CheckOutStatusEnum.Undefined,
        userId: userId,
        name: name,
      },
    });
  }

  async summaryByLevelDate(date: string) {
    const levels = await this.level.findAll();
    const summArr = [];
    for (const lv of levels) {
      const res = await this.prisma.historicAtt.findMany({
        where: { AND: [{ date: date }, { level: lv.name }] },
      });

      const absent = res.filter((item) => item.attendanceStatus === AttendanceStatusEnum.Absent);
      const summary = {
        level: lv.name,
        total: res.length,
        absent: absent.length,
      };
      summArr.push(summary);
    }
    return summArr;
  }

  async filterStatusByLevelDate(
    date?: string,
    level?: string,
    status?: AttendanceStatusEnum,
    page = 1,
  ) {
    const total = await this.prisma.historicAtt.count({
      where: { date: date },
    });
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.historicAtt.findMany({
      where: {
        AND: [{ date: date }, { attendanceStatus: status }, { level: level }],
      },
      take: 10,
      skip: 10 * (page - 1),
    });
    return {
      data: res,
      pagination: {
        totalData: total,
        totalPages: pages,
        dataPerPage: total / pages,
      },
    };
  }

  async findAllByLevelAndDate(level: string, date: string, page: number) {
    return await this.prisma.historicAtt.findMany({
      where: { AND: [{ level: level }, { date: date }] },
      take: 10,
      skip: 10 * (page - 1),
    });
  }

  async exportDataByDate(date: string) {
    const data = await this.prisma.historicAtt.findMany({
      where: { date: date },
    });
    const res = await this.excel.dowloadExcel(data);
    return res;
  }

  async exportDataByLevelDateRange(
    startDate: string,
    endDate: string,
    level: string,
  ) {
    const data = [];
    const users = await this.prisma.users.findMany({
      where: { level: level },
    });
    for (const user of users) {
      const early = await this.prisma.historicAtt.count({
        where: {
          AND: [
            { attendanceStatus: AttendanceStatusEnum.Early },
            { date: { gte: startDate } },
            { date: { lte: endDate } },
            { userId: user.id },
            { level: level },
          ],
        },
      });
      const late = await this.prisma.historicAtt.count({
        where: {
          AND: [
            { attendanceStatus: AttendanceStatusEnum.Late },
            { date: { gte: startDate } },
            { date: { lte: endDate } },
            { userId: user.id },
            { level: level },
          ],
        },
      });
      const absent = await this.prisma.historicAtt.count({
        where: {
          AND: [
            { attendanceStatus: AttendanceStatusEnum.Absent },
            { date: { gte: startDate } },
            { date: { lte: endDate } },
            { userId: user.id },
            { level: level },
          ],
        },
      });
      data.push({
        date: startDate + ' - ' + endDate,
        name: user.name,
        id: user.id,
        early: early,
        late: late,
        absent: absent,
      });
    }
    const res = await this.excel.downloadExcelByLevel(data, level);
    return res;
  }



  private getDaysBetweenDates(startDateStr: string, endDateStr: string): string[] {
    const [startDay, startMonth, startYear] = startDateStr.split('-').map(Number);
    const [endDay, endMonth, endYear] = endDateStr.split('-').map(Number);

    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    const dateList = [];
    // const currentDate = new Date(startDate);

    while (startDate <= endDate) {
      const year = startDate.getFullYear();
      const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
      const day = startDate.getDate().toString().padStart(2, '0');
      dateList.push(`${day}-${month}-${year}`);
      startDate.setDate(startDate.getDate() + 1);
    }
    return dateList;
  }

  async getSummaryAttendanceByDateRange(
    startDate: string,
    endDate: string,
    userId: string
  ) {
    const dateList = this.getDaysBetweenDates(startDate, endDate);

    // for (const date of dateList) {
    //   try {
    //     await this.attendance.calculateAttendance(date, userId)
    //   } catch (error) {
    //     // Handle the error here, you can log it or take any necessary action
    //     console.error(`Error creating attendance: ${error.message}`);
    //     // Continue with the next iteration of the loop
    //     continue;
    //   }
      
    // }
    const total = await this.prisma.historicAtt.count({
      where: {
        AND: [
          { userId: userId },
          { date: { in: dateList } }
        ]
      },
    })
    const absent = await this.prisma.historicAtt.count({
      where: {
        AND: [
          { userId: userId },
          { date: { in: dateList } },
          { attendanceStatus: AttendanceStatusEnum.Absent }
        ]
      },
    })
    const early = await this.prisma.historicAtt.count({
      where: {
        AND: [
          { userId: userId },
          { date: { in: dateList } },
          { attendanceStatus: AttendanceStatusEnum.Early }
        ]
      },
    })
    const late = await this.prisma.historicAtt.count({
      where: {
        AND: [
          { userId: userId },
          { date: { in: dateList } },
          { attendanceStatus: AttendanceStatusEnum.Late }
        ]
      },
    })

    console.log("total", total);
    
    const attendanceData = {
      "duration": `${startDate} - ${endDate}`,
      "total": total,
      "absent": absent,
      "early": early,
      "late": late,
    }
    return attendanceData;
  }


}
