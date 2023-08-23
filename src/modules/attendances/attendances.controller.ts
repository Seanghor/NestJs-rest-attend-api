import { BadRequestException, Controller, Get, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendanceEntity as Attendance } from './attendance.entity';
import { ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Body, Delete, Param, Query, UseFilters } from '@nestjs/common/decorators';
import { AttendanceDto } from './dto/attendance.dto';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorateor';

@Controller('attendances')
@UseFilters(HttpExceptionFilter)
@ApiTags('attendances')
export class AttendancesController {
  constructor(private readonly attendanceService: AttendancesService) { }


  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() attendanceDto: AttendanceDto) {
    const patternTimeFormat = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!patternTimeFormat.test(attendanceDto.time)) {
      throw new BadRequestException('Time not in the correct 24-hour format.');
    }
    return this.attendanceService.create(attendanceDto);
  }

  @Get()
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'level', required: false })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async findAttendances(
    @Query('date') date?: string,
    @Query('userId') userId?: string,
    @Query('level') level?: string,
  ) {
    if (date && level) {
      return await this.attendanceService.findAllByLevelAndDate(level, date);
    } else if (date) {
      return await this.attendanceService.findAllByDate(date);
    } else if (level) {
      return await this.attendanceService.findAllByLevel(level);
    } else if (userId) {
      return await this.attendanceService.findAllByUserId(userId);
    } else {
      return await this.attendanceService.findAll();
    }
  }

  @Get('calculateAttendance/:date/:userId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiCreatedResponse({ type: Attendance })
  async calculateAttendance(
    @Param('date') date: string,
    @Param('userId') userId: string,
  ) {
    return await this.attendanceService.calculateAttendance(date, userId);
  }


  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const existingAtt = await this.attendanceService.findOneById(id);
    if (!existingAtt) throw new BadRequestException('Attendance not found');
    return this.attendanceService.deleteOne(id);
  }
}
