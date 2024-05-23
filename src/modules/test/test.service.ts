import { Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExcelService } from '../excel/excel.service';

@Injectable()
export class TestService {
  constructor(
    private prisma: PrismaService,
    private excel: ExcelService,
  ) { }
  create(createTestDto: CreateTestDto) {
    return 'This action adds a new test';
  }

  async exportAllUser() {
    const data = []
    const users = await this.prisma.users.findMany();
    // for (const user of users) {
    //   data.push({
    //     id: user.id,
    //     name: user.name,
    //     role: "STUDENT",
    //     faceString: user.faceString,
    //     checkIn: user.checkIn,
    //     checkOut: user.checkOut,
    //     level: "string",
    //     teacher: null,
    //     fatherName: null,
    //     fatherNumber: null,
    //     fatherChatId: null,
    //     motherName: null,
    //     motherNumber: null,
    //     motherChatId: null,
    //     learningShift: null,
    //     createAt: user.createdAt
    //   })
    // }
    // const res = await this.excel.downloadExcelAllUsers(data)
    // console.log(res);
    return users
  }

  async exportAllAttendance() {
    const data = []
    const users = await this.prisma.attendances.findMany();
    // for (const user of users) {
    //   data.push({
    //     id: user.id,
    //     date: user.date,
    //     level: "string",
    //     checkIn: "--:--",
    //     checkOut: "--:--",
    //     temperature: null,
    //     attendanceStatus: null,
    //     checkOutStatus: null,
    //     userId: null,
    //     name: null,
    //   })
    // }
    // const res = await this.excel.downloadExcelAllUsers(data)
    // console.log(res);
    return users
  }

  async exportAllHistAttendance() {
    const hists = await this.prisma.historicAtt.findMany();
    return hists
  }
  async exportAllAttendanceRule() {
    const hists = await this.prisma.attendanceRule.findMany();
    return hists
  }

  async exportAllLocation() {
    const hists = await this.prisma.location.findMany();
    return hists
  }

  findOne(id: number) {
    return `This action returns a #${id} test`;
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return `This action updates a #${id} test`;
  }

  remove(id: number) {
    return `This action removes a #${id} test`;
  }
}
