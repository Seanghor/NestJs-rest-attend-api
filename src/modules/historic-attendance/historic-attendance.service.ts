import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExcelService } from '../excel/excel.service';
import { LocationService } from '../location/location.service';
import { HistoricAttDto } from './dto/historic-attendance.dto';

@Injectable()
export class HistoricAttendanceService {
  constructor(
    private prisma: PrismaService,
    private location: LocationService,
    private excel: ExcelService,
  ) { }

  async create(history: HistoricAttDto) {
    return await this.prisma.historicAtt.create({ data: { ...history } });
  }



  async findAllPage() {
    const total = await this.prisma.historicAtt.count();
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.historicAtt.findMany({});
    return {
      data: res,
      pagination: {
        totalPages: pages,
      },
    };
  }

  async findAllByUserEmail(userEmail: string) {
    return await this.prisma.historicAtt.findMany({ where: { userEmail } });
  }

  async findAllByDateAndEmail(date: string, userEmail: string) {
    const res = await this.prisma.historicAtt.findUnique({
      where: { date_userEmail: { date, userEmail } },
    });
    // console.log("res:", res);
    return res
  }
  async findAll(date: string, location: string, status: string) {
    let whereConditions = []

    console.log(">>>>>>>>>>>>>>>>> date:", date);
    console.log(">>>>>>>>>>>>>>>>> location:", location);
    console.log(">>>>>>>>>>>>>>>>> status:", status);
    if (date) {
      whereConditions.push({ date });
    } else {
      console.log(">>>>>>>>>>>>>>>>> date is empty");
    }

    if (location) {
      whereConditions.push({ location });
    } else {
      console.log(">>>>>>>>>>>>>>>>> location is empty");
    }
    if (status) {
      whereConditions.push({ attendanceStatus: status });
    } else {
      console.log(">>>>>>>>>>>>>>>>> status is empty");
    }
    console.log(">>>>>>>>>>>>>>>>> whereConditions:", whereConditions);


    // if (date && status && location) {
    //   whereConditions = { AND: [{ date }, { attendanceStatus: status }, { location }] };
    // } else if (date && location) {
    //   whereConditions = { AND: [{ date }, { location }] };
    // } else if (date && status) {
    //   whereConditions = { AND: [{ date }, { attendanceStatus: status }] };
    // } else if (location && status) {
    //   whereConditions = { AND: [{ location }, { attendanceStatus: status }] };
    // } else if (date) {
    //   whereConditions = { date };
    // } else if (location) {
    //   whereConditions = { location };
    // } else if (status) {
    //   whereConditions = { attendanceStatus: status };
    // }

    return await this.prisma.historicAtt.findMany({
      where: {
        // AND: [filterDate, filterLocation, filterStatus]
        AND: whereConditions
      },
    });
  }


  async findAllByDate(date: string) {
    const res = await this.prisma.historicAtt.findMany({ where: { date } });
    return { data: res }
  }

  async findAllByDatePage(date: string) {
    const total = await this.prisma.historicAtt.count({ where: { date } });
    const pages = Math.ceil(total / 10);
    const his = await this.prisma.historicAtt.findMany({
      where: { date },
    });
    return {
      data: his,
      pagination: {
        totalPages: pages,
      },
    };
  }

  async delete(id: number) {
    return await this.prisma.historicAtt.delete({ where: { id } });
  }

  async findAllByLocation(location: string) {
    return await this.prisma.historicAtt.findMany({
      where: { location: location },
    });
  }

  async findOneByDateAndEmail(date: string, userEmail: string) {
    return await this.prisma.attendances.findMany({
      where: { AND: [{ date: date }, { userEmail: userEmail }] },
    });
  }

  async findAllByDateStatus(date: string, status: string) {
    const res = await this.prisma.historicAtt.findMany({
      where: { AND: [{ date: date }, { attendanceStatus: status }] },
    });
    return { data: res }
  }

  async findAllByDateStatusPage(date: string, status: string) {
    const total = await this.prisma.historicAtt.count({
      where: { AND: [{ date: date }, { attendanceStatus: status }] },
    });
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.historicAtt.findMany({
      where: { AND: [{ date: date }, { attendanceStatus: status }] },
    });
    return {
      data: res,
      pagination: {
        totalPages: pages,
      },
    };
  }

  async findAllByLocationStatus(location: string, status: string) {
    const res = await this.prisma.historicAtt.findMany({
      where: { AND: [{ location: location }, { attendanceStatus: status }] },
    });
    return { data: res }
  }

  async findAllByLocationStatusPage(location: string, status: string) {
    const total = await this.prisma.historicAtt.count({
      where: { AND: [{ location: location }, { attendanceStatus: status }] },
    });
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.historicAtt.findMany({
      where: { AND: [{ location: location }, { attendanceStatus: status }] },
    });
    return {
      data: res,
      pagination: {
        totalPages: pages,
      },
    };
  }

  async markAbsentAttendance(
    date: string,
    userEmail: string,
    location: string,
  ) {
    const data = {
      date: date,
      temperature: 'undefined',
      location: location,
      checkIn: '--:--',
      checkOut: '--:--',
      attendanceStatus: 'Absent',
      checkOutStatus: 'undefined',
      userEmail: userEmail,
    }
    console.log(">>>>>>>>>>>>>>>>> data:", data);

    // const res = await this.prisma.historicAtt.create({
    //   data: {
    //     date: date,
    //     temperature: 'undefined',
    //     location: location,
    //     checkIn: '--:--',
    //     checkOut: '--:--',
    //     attendanceStatus: 'Absent',
    //     checkOutStatus: 'undefined',
    //     userEmail: userEmail,
    //   },
    // });
    // const res = await this.prisma.historicAtt.create({ data });
    try {
      const res = await this.prisma.historicAtt.create({ data });
      console.log('Insert successful:', res);
    } catch (error) {
      console.error('Error creating historic attendance record:', error);
      // Handle error based on type, e.g., throw specific errors or return error messages
    }

    // console.log('>>>>>>>>>>>>>>>>> res:', res);

    // return res
  }

  async summaryByLocationDate(date: string) {
    const location = await this.location.findAll();
    const summArr = [];
    for (const loc of location) {
      const res = await this.prisma.historicAtt.findMany({
        where: { AND: [{ date: date }, { location: loc.name }] },
      });

      const absent = res.filter((item) => item.attendanceStatus === 'Absent');
      const unusual_temp = res.filter(
        (item) => parseFloat(item.temperature) >= 37.5,
      );
      const summary = {
        location: loc.name,
        total: res.length,
        absent: absent.length,
        unusual_temp: unusual_temp.length,
      };
      summArr.push(summary);
    }
    return summArr;
  }

  async filterStatusByLocationDate(
    date?: string,
    location?: string,
    status?: string,
  ) {
    const res = await this.prisma.historicAtt.findMany({
      where: {
        AND: [
          { date: date },
          { attendanceStatus: status },
          { location: location },
        ],
      },
    });
    return { data: res }
  }

  async filterStatusByLocationDatePage(
    date?: string,
    location?: string,
    status?: string,
  ) {
    const total = await this.prisma.historicAtt.count({
      where: { date: date },
    });
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.historicAtt.findMany({
      where: {
        AND: [
          { date: date },
          { attendanceStatus: status },
          { location: location },
        ],
      },
    });
    return {
      data: res,
      pagination: {
        totalPages: pages,
      },
    };
  }

  async findAllByLocationDate(location: string, date: string) {
    const res = await this.prisma.historicAtt.findMany({
      where: { AND: [{ location: location }, { date: date }] },
    });
    return { data: res }
  }

  async findAllByLocationDatePage(location: string, date: string) {
    const total = await this.prisma.historicAtt.count({
      where: { AND: [{ location: location }, { date: date }] },
    });
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.historicAtt.findMany({
      where: { AND: [{ location: location }, { date: date }] },
    });
    return {
      data: res,
      pagination: {
        totalPages: pages,
      },
    };
  }

  async exportDataByDate(date: string) {
    const data = await this.prisma.historicAtt.findMany({
      where: { date: date, location: 'Borey M50', userEmail: { contains: '22@kit.edu.kh' } },
    });
    const res = await this.excel.dowloadExcel(data);
    console.log(">>>>>>>>>>>>>>>>> res:", data);

    return res;
  }

  async exportDataByLocationDateRange(
    startDate: string,
    endDate: string,
    location: string,
  ) {
    const data = [];
    const users = await this.prisma.users.findMany({
      where: { location: location },
    });
    for (const user of users) {
      const count = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDate}, 'dd-mm-yyyy') AND to_date(${endDate}, 'dd-mm-yyyy') AND users.email = ${user.email} AND htp."location" = ${location}`;
      const total = Number(count[0].count);
      const lateCount = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDate}, 'dd-mm-yyyy') AND to_date(${endDate}, 'dd-mm-yyyy') AND users.email = ${user.email} AND htp."attendanceStatus" = 'Late' AND htp."location" = ${location}`;
      const late = Number(lateCount[0].count);
      const absentCount = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDate}, 'dd-mm-yyyy') AND to_date(${endDate}, 'dd-mm-yyyy') AND users.email = ${user.email} AND htp."attendanceStatus" = 'Absent' AND htp."location" = ${location}`;
      const absent = Number(absentCount[0].count);
      data.push({
        date: startDate + ' - ' + endDate,
        name: user.name,
        email: user.email,
        total: total,
        late: late,
        absent: absent,
        percentage:
          String(Math.round(((total - absent) / total) * 100)) + ' ' + '%',
      });
    }
    const res = await this.excel.downloadExcelByLocation(data, location);
    console.log(">>>>>>>>>>>>>>>>> res:", res);

    return res;
  }

  async exportDataByDateRangeUsers(
    startDate: string,
    endDate: string,
    users: string[],
  ) {
    const data = [];
    for (const user of users) {
      const name = await this.prisma
        .$queryRaw`SELECT name FROM public."Users" as users WHERE users.email = ${user}`;
      const count = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDate}, 'dd-mm-yyyy') AND to_date(${endDate}, 'dd-mm-yyyy') AND users.email = ${user}`;
      const total = Number(count[0].count);
      const lateCount = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDate}, 'dd-mm-yyyy') AND to_date(${endDate}, 'dd-mm-yyyy') AND users.email = ${user} AND htp."attendanceStatus" = 'Late'`;
      const late = Number(lateCount[0].count);
      const absentCount = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDate}, 'dd-mm-yyyy') AND to_date(${endDate}, 'dd-mm-yyyy') AND users.email = ${user} AND htp."attendanceStatus" = 'Absent'`;
      const absent = Number(absentCount[0].count);
      data.push({
        date: startDate + ' - ' + endDate,
        name: name,
        email: user,
        total: total,
        late: late,
        absent: absent,
        percentage:
          String(Math.round(((total - absent) / total) * 100)) + ' ' + '%',
      });
    }
    const res = await this.excel.downloadExcelByDateRange(data);
    return res;
  }

  async exportDataByLocationMonth(
    month: number,
    year: number,
    location: string,
  ) {
    const startDate = new Date(year, month - 1, 1);   // jan = 0, Feb=1, ....
    const endDate = new Date(year, month, 0);

    const day = startDate.getDate().toString().padStart(2, '0');
    const months = (startDate.getMonth() + 1).toString().padStart(2, '0');
    const years = startDate.getFullYear().toString();
    const startDateStr = `${day}-${months}-${years}`;

    const day2 = endDate.getDate().toString().padStart(2, '0');
    const months2 = (endDate.getMonth() + 1).toString().padStart(2, '0');
    const years2 = endDate.getFullYear().toString();
    const endDateStr = `${day2}-${months2}-${years2}`;

    const data = [];
    const users = await this.prisma.users.findMany({
      where: { location: location },
    });
    for (const user of users) {
      const count = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDateStr}, 'dd-mm-yyyy') AND to_date(${endDateStr}, 'dd-mm-yyyy') AND users.email = ${user.email} AND htp."location" = ${location}`;
      const total = Number(count[0].count);
      const lateCount = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDateStr}, 'dd-mm-yyyy') AND to_date(${endDateStr}, 'dd-mm-yyyy') AND users.email = ${user.email} AND htp."attendanceStatus" = 'Late' AND htp."location" = ${location}`;
      const late = Number(lateCount[0].count);
      const absentCount = await this.prisma
        .$queryRaw`SELECT COUNT(*) FROM public."HistoricAtt" as htp JOIN public."Users" as users ON htp."userEmail" = users.email WHERE to_date(htp.date, 'dd-mm-yyyy') BETWEEN to_date(${startDateStr}, 'dd-mm-yyyy') AND to_date(${endDateStr}, 'dd-mm-yyyy') AND users.email = ${user.email} AND htp."attendanceStatus" = 'Absent' AND htp."location" = ${location}`;
      const absent = Number(absentCount[0].count);
      data.push({
        month: month,
        year: year,
        name: user.name,
        email: user.email,
        total: total,
        late: late,
        absent: absent,
        percentage:
          String(Math.round(((total - absent) / total) * 100)) + ' ' + '%',
      });
    }
    const res = await this.excel.downloadExcelByMonthAndLocation(
      data,
      location,
    );
    return res;
  }



  async getSummaryByEachLocation(date: string) {
    const location = await this.location.findAll();
    const summArr = [];
    for (const loc of location) {
      const totalUsers = await this.prisma.users.count({
        where: {
          location: loc.name
        }
      })
      const presets = await this.prisma.historicAtt.count({
        where: {
          OR: [
            { AND: [{ date: date }, { location: loc.name }, { attendanceStatus: 'Late' }] },
            { AND: [{ date: date }, { location: loc.name }, { attendanceStatus: "Early" }] }
          ]
        },
      })

      console.log(">>>>> totalUsers of ", loc, ":", totalUsers);

      console.log(">>>>>>>>>>>>>>>>> presets of ", loc, ":", presets);

      const absents = await this.prisma.historicAtt.count({
        where: { AND: [{ date: date }, { location: loc.name }, { attendanceStatus: 'Absent' }] },
      })
      console.log(">>>>>>>>>>>>>>>>> absents of ", loc, ":", absents);
      console.log("------------------------------------------------------------");
      console.log("");
      const summary = {
        location: loc.name,
        total: totalUsers,
        present: presets,
        absent: absents,
      };
      summArr.push(summary);
    }
    return summArr;
  }
}
