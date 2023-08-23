import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminDto } from './dto/admin.dto';
import { HashPasswordService } from '../util/hashing-password';


@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService, private hashingService: HashPasswordService) { }

  async create(admin: AdminDto, adminId:number) {
    admin.password = await this.hashingService.hashPassword(admin.password)
    return await this.prisma.admin.create({
      data: {...admin, createBySuperAdminId: adminId}
    });
  }

  async findAll() {
    return await this.prisma.admin.findMany();
  }

  async findOneByEmail(email: string) {
    const foundEmail = await this.prisma.admin.findUnique({ where: { email } });
    return foundEmail;
  }

  async findOneById(id: number) {
    const foundId = await this.prisma.admin.findUnique({ where: { id } });
    return foundId;
  }
}
