import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceDto } from './dto/attendance.dto';

@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

  create(attendance: AttendanceDto) {
    return this.prisma.attendances.create({ data: { ...attendance } });
  }

  findAll() {
    return this.prisma.attendances.findMany();
  }

  findAllByUserEmail(userEmail: string) {
    return this.prisma.attendances.findMany({ where: { userEmail } });
  }

  findAllByDate(date: string) {
    return this.prisma.attendances.findMany({ where: { date } });
  }

  findAllByLocationAndDate(location: string, date: string) {
    return this.prisma.attendances.findMany({
      where: { AND: [{ location: location }, { date: date }] },
    });
  }

  findAllByLocation(location: string) {
    return this.prisma.attendances.findMany({ where: { location: location } });
  }

  deleteOne(id: number) {
    return this.prisma.attendances.delete({ where: { id } });
  }
}
