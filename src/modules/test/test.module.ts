import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { ExcelService } from '../excel/excel.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TestController],
  providers: [TestService,  ExcelService, PrismaService]
})
export class TestModule {}
