import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiTags } from '@nestjs/swagger';
import { AttendanceRuleService } from './attendance-rule.service';
import { AttendanceRuleDto } from './dto/attendance-rule.dto';
import { RolesGuard } from 'src/auth/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';
// import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorateor';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { UserRole } from '@prisma/client';

@Controller('attendance-rule')
@ApiTags('attendance-rule')
@UseFilters(HttpExceptionFilter)
export class AttendanceRuleController {
  constructor(private readonly attendanceRuleService: AttendanceRuleService) { }

  @Post()
  @ApiAcceptedResponse({ type: AttendanceRuleService })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async create(@Body() attendanceRuleDto: AttendanceRuleDto) {
    const patternNumFormat = /^-?\d*\.?\d+$/;
    console.log('earlyMinute IsNumber :', patternNumFormat.test(attendanceRuleDto.earlyMinute));
    console.log('lateMinute IsNumber :', patternNumFormat.test(attendanceRuleDto.lateMinute));
    if (!patternNumFormat.test(attendanceRuleDto.earlyMinute) && !patternNumFormat.test(attendanceRuleDto.lateMinute)) {
      throw new BadRequestException('Both earlyMinute and lateMinute are not in string of number')
    }
    else if (!patternNumFormat.test(attendanceRuleDto.earlyMinute) || !patternNumFormat.test(attendanceRuleDto.lateMinute)) {
      throw new BadRequestException('One or both earlyMinute and lateMinute are not in string of number')
    }
    const patternTimeFormat = /^([01]\d|2[0-3]):[0-5]\d$/;
    console.log('onDutyTime IsNumber :', patternTimeFormat.test(attendanceRuleDto.onDutyTime));
    console.log('offDutyTime IsNumber :', patternTimeFormat.test(attendanceRuleDto.offDutyTime));
    if (!patternTimeFormat.test(attendanceRuleDto.onDutyTime) && !patternTimeFormat.test(attendanceRuleDto.offDutyTime)) {
      throw new BadRequestException('Both onDutyTime and offDutyTime are not in the correct 24-hour format.');
    }
    else if (!patternTimeFormat.test(attendanceRuleDto.onDutyTime) || !patternTimeFormat.test(attendanceRuleDto.offDutyTime)) {
      throw new BadRequestException('One or both onDutyTime and offDutyTime are not in the correct 24-hour format.');
    }
    return await this.attendanceRuleService.create(attendanceRuleDto);
  }

  @Patch(':id')
  @ApiAcceptedResponse({ type: AttendanceRuleService })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async update(@Param('id', ParseIntPipe) id: number, @Body() attendanceRuleDto: AttendanceRuleDto) {
    const existing = await this.attendanceRuleService.findOne(+id)
    if (!existing) {
      throw new NotFoundException("Attendance-rule not found")
    }

    const patternNumFormat = /^-?\d*\.?\d+$/;
    console.log('earlyMinute IsNumber :', patternNumFormat.test(attendanceRuleDto.earlyMinute));
    console.log('lateMinute IsNumber :', patternNumFormat.test(attendanceRuleDto.lateMinute));
    if (!patternNumFormat.test(attendanceRuleDto.earlyMinute) && !patternNumFormat.test(attendanceRuleDto.lateMinute)) {
      throw new BadRequestException('Both earlyMinute and lateMinute are not in string of number')
    }
    else if (!patternNumFormat.test(attendanceRuleDto.earlyMinute) || !patternNumFormat.test(attendanceRuleDto.lateMinute)) {
      throw new BadRequestException('One or both earlyMinute and lateMinute are not in string of number')
    }
    const patternTimeFormat = /^([01]\d|2[0-3]):[0-5]\d$/;
    console.log('onDutyTime IsNumber :', patternTimeFormat.test(attendanceRuleDto.onDutyTime));
    console.log('offDutyTime IsNumber :', patternTimeFormat.test(attendanceRuleDto.offDutyTime));
    if (!patternTimeFormat.test(attendanceRuleDto.onDutyTime) && !patternTimeFormat.test(attendanceRuleDto.offDutyTime)) {
      throw new BadRequestException('Both onDutyTime and offDutyTime are not in the correct 24-hour format.');
    }
    else if (!patternTimeFormat.test(attendanceRuleDto.onDutyTime) || !patternTimeFormat.test(attendanceRuleDto.offDutyTime)) {
      throw new BadRequestException('One or both onDutyTime and offDutyTime are not in the correct 24-hour format.');
    }
    return await this.attendanceRuleService.update(+id, attendanceRuleDto);
  }

  @Delete()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiAcceptedResponse({ type: AttendanceRuleService })
  async deleteAll() {
    return await this.attendanceRuleService.deleteAll();
  }

  @Delete(':id')
  @ApiAcceptedResponse({ type: AttendanceRuleService })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const existing = await this.attendanceRuleService.findOne(+id)
    if (!existing) {
      throw new NotFoundException("Attendance-rule not found")
    }
    return await this.attendanceRuleService.deleteOne(+id);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiAcceptedResponse({ type: AttendanceRuleService })
  async findAll() {
    return await this.attendanceRuleService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiAcceptedResponse({ type: AttendanceRuleService })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const attedanceRule = await this.attendanceRuleService.findOne(id);
    if (!attedanceRule) throw new NotFoundException("Attendance-rule not found")
    return attedanceRule
  }
}