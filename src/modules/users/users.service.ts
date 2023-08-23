import { Injectable, UseFilters } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationService } from '../location/location.service';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { Multer } from 'multer';

export type Admin = any;
@Injectable()
@UseFilters(HttpExceptionFilter)
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private location: LocationService,
  ) { }

  private readonly admins = [
    {
      userId: 1,
      email: 'ouk.sovannratana19@kit.edu.kh',
      password: 'password',
    },
    {
      userId: 2,
      email: 'heng.kevin19@kit.edu.kh',
      password: 'password',
    },
  ];

  async create(user: UserDto) {
    return await this.prisma.users.create({ data: user });
  }

  async bulkCreate(users: UserDto[]) {
    for (const data of users) {
      const face = data.faceString;
      const array = face.split(',');

      if (!data.name || array.length !== 512) {
        continue;
      }
      await this.prisma.users.create({
        data: data
      });
    }
    return 'Success';
  }


  async readFromJson(file: Multer.File): Promise<any> {
    const jsonData = JSON.parse(file.buffer.toString('utf8')) as UserDto[];
    for (const data of jsonData) {
      const face = data.faceString;
      const array = face.split(',');

      if (!data.name || array.length !== 512) {
        continue;
      } else {

        await this.prisma.users.create({ data });
      }
    }
    return 'Success';
  }


  async findAll() {
    return await this.prisma.users.findMany({});
  }

  async findAllPaginated(page: number) {
    const total = await this.prisma.users.count();
    const pages = Math.ceil(total / 10);
    console.log(pages);

    const res = await this.prisma.users.findMany({
      take: 10,
      skip: 10 * (page - 1),
    });
    return {
      pagination: {
        totalData: total,
        totalPages: pages,
        dataPerPage: total / pages,
      },
      data: res,
    };
  }

  async findOne(id: string) {
    return await this.prisma.users.findUnique({ where: { id } });
  }

  // async findAdminByEmail(email: string): Promise<Admin | undefined> {
  //   const foundAdmin = this.admins.find((admin) => admin.email === email);
  //   console.log(foundAdmin);
  //   return foundAdmin;
  // }


  // async findAllByLocation() {
  //   const locations = await this.location.findAll();
  //   const userArr = [];
  //   for (const loc of locations) {
  //     const total = await this.prisma.users.count({
  //       where: { location: loc.name },
  //     });
  //     const users = {
  //       location: loc.name,
  //       total: total,
  //     };
  //     userArr.push(users);
  //   }
  //   return userArr;
  // }

  async findAllByLevel(level: string) {
    return await this.prisma.users.findMany({ where: { level } });
  }

  async deleteOne(id: string) {
    return await this.prisma.users.delete({ where: { id } });
  }

  async updateOneName(id: string, name: string) {
    return await this.prisma.users.update({
      where: { id },
      data: { name: name },
    });
  }

  async updateOneUser(
    id: string,
    data: {
      name?: string;
      faceString?: string;
      level?: string;
      teacher?: string;

      fatherName?: string;
      fatherNumber?: string;
      fatherChatId?: string;

      motherName?: string;
      motherNumber?: string;
      motherChatId?: string;

      checkIn?: string;
      checkOut?: string;

      // learningSupportNumber?: string;
      // learningSupport?: string;
      learningShift?: string;
    },
  ) {
    const user = await this.prisma.users.update({ where: { id: id }, data });
    return user;
  }


}
