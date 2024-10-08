import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationDto } from './dto/location.dto';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) { }

  async create(location: LocationDto) {
    const res = await this.prisma.location.create({ data: { ...location } });
    return res
  }

  async findAll() {
    return await this.prisma.location.findMany();
  }

  async findAllPage() {
    const total = await this.prisma.location.count();
    const pages = Math.ceil(total / 10);
    const res = await this.prisma.location.findMany({});
    return {
      data: res,
      pagination: {
        totalPages: pages,
      },
    };
  }

  async findOneById(id: number) {
    return await this.prisma.location.findUnique({ where: { id } });
  }

  async findOneByName(name: string) {
    return await this.prisma.location.findFirst({
      where: {
        name: { contains: name, mode: 'insensitive' }
      },
    });
  }

  async update(id: number, location: LocationDto) {
    return await this.prisma.location.update({
      where: { id },
      data: { ...location },
    });
  }

  async delete(id: number) {
    return await this.prisma.location.delete({ where: { id } });
  }
}
