import { Injectable } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LevelService {
  constructor(private prisma: PrismaService) { }

  async create(createLevelDto: CreateLevelDto) {
    return await this.prisma.level.create({ data: { ...createLevelDto } });
  }

  async findAll() {
    return await this.prisma.level.findMany();
  }

  async findOneById(id: number) {
    return await this.prisma.level.findUnique({ where: { id } });
  }

  async findOneByName(name: string) {
    return await this.prisma.level.findFirst({
      where: {
        name: { contains: name, mode: 'insensitive' }
      },
    });
  }

  async update(id: number, updateLevelDto: UpdateLevelDto) {
    return await this.prisma.level.update({ where: { id }, data: { ...updateLevelDto } });
  }

  async remove(id: number) {
    return await this.prisma.level.delete({ where: { id } });
  }

  async deleteAll() {
    const levels = await this.prisma.level.findMany();
    for (const lv of levels) {
      await this.remove(lv.id);
    }
    return { message: 'All levels has been deleted' };
  }
}
