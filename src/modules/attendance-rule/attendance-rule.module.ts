import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceRuleController } from './attendance-rule.controller';
import { AttendanceRuleService } from './attendance-rule.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AttendanceRuleController],
  providers: [AttendanceRuleService, PrismaService, JwtService],
})
export class AttendanceRuleModule {}
