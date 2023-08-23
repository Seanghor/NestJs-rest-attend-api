import { PrismaService } from './../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';

@Module({
  controllers: [LevelController],
  providers: [LevelService, PrismaService]
})
export class LevelModule {}
