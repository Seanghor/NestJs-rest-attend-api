import { BadRequestException, Controller, Get, NotFoundException, Res, UseGuards } from '@nestjs/common';
import { Body, Delete, Param, Post, Query, UseFilters } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { HistoricAttDto } from './dto/historic-attendance.dto';
import { HistoricAttendanceService } from './historic-attendance.service';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
// import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorateor';
import * as fs from 'fs';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { AttendanceStatusEnum, CheckOutStatusEnum, UserRole } from '@prisma/client';
import { LevelService } from '../level/level.service';

@Controller('historic-attendance')
@UseFilters(HttpExceptionFilter)
@ApiTags('historic-attendance')
export class HistoricAttendanceController {
  constructor(
    private readonly historicAttendanceService: HistoricAttendanceService,
    private readonly levelService: LevelService,
  ) { }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiQuery({ name: 'page', required: false })
  async findAll(@Query('page') page: string) {
    const patternNumFormat = /^-?\d*\.?\d+$/;
    if (!patternNumFormat.test(page)) {
      throw new BadRequestException('Page does not in string of number')
    }
    return await this.historicAttendanceService.findAll(+page);
  }


  @Get('/level/:level')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async findAllByLevel(@Param('level') location: string) {
    return await this.historicAttendanceService.findAllByLevel(location);
  }

  @Get('/date/:date')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async findAllByDate(@Param('date') date: string, @Query('page') page: string) {
    return await this.historicAttendanceService.findAllByDate(date, +page);
  }

  @Get(':date/:userId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async findAllByDateAndUserId(
    @Param('date') date: string,
    @Param('userId') userId: string,
  ) {
    const histAtt = await this.historicAttendanceService.findAllByDateAndId(date, userId);
    return histAtt;
  }

  @Get('/level/date/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  async findAllByLevelDateStatus(
    @Query('date') date?: string,
    @Query('level') level?: string,
    @Query('status') status?: AttendanceStatusEnum,
    @Query('page') page?: string,
  ) {
    if (date && level && status) {
      return await this.historicAttendanceService.filterStatusByLevelDate(
        date,
        level,
        status,
        +page,
      );
    } else if (date && level) {
      return await this.historicAttendanceService.findAllByLevelAndDate(
        level,
        date,
        +page,
      );
    } else {
      return this.historicAttendanceService.findAllByDate(date, +page);
    }
  }

  @Get('/attendance/level/date/:date')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async summaryByLevelDate(@Param('date') date: string) {
    return await this.historicAttendanceService.summaryByLevelDate(date);
  }

  @Get(':userId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async findAllByUserId(@Param('userId') userId: string) {
    return await this.historicAttendanceService.findAllByUserId(userId);
  }

  @Get('/one/:date/:userId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async findOneByDateAndUserId(
    @Param('date') date: string,
    @Param('userId') userId: string,
  ) {

    const histAtt = await this.historicAttendanceService.findOneByDateAndId(date, userId);
    if (!histAtt) throw new BadRequestException('Hist-attendance data found');
    return histAtt;
  }

  @Get('/attendance/excel/level/date')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'level', required: false })
  async excelByLevelDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('level') level: string,
    @Res() res: Response,
  ) {
    const exportPath =
      await this.historicAttendanceService.exportDataByLevelDateRange(
        startDate,
        endDate,
        level,
      );
    console.log("exportPath", exportPath)


    fs.promises
      .stat(exportPath)
      .then((stat) => {
        if (stat.isFile()) {
          res.download(exportPath, level + '.xlsx', (err) => {
            if (err) {
              console.log(err);
            } else {
              fs.unlinkSync(exportPath);
            }
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }


  // @Get('/attendance/excel/month/location')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  // @ApiQuery({ name: 'month', required: false })
  // @ApiQuery({ name: 'level', required: false })
  // @ApiQuery({ name: 'year', required: false })
  // async excelByMonthLocation(
  //   @Query('month') month: number,
  //   @Query('year') year: number,
  //   @Query('level') level: string,
  //   @Res() res: Response,
  // ) {
  //   const exportPath =
  //     await this.historicAttendanceService.exportDataByLocationMonth(
  //       month,
  //       year,
  //       level,
  //     );
  //   fs.promises
  //     .stat(exportPath)
  //     .then((stat) => {
  //       if (stat.isFile()) {
  //         res.download(exportPath, 'attendance.xlsx', (err) => {
  //           if (err) {
  //             console.log(err);
  //           } else {
  //             fs.unlinkSync(exportPath);
  //           }
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Get('/attendance/excel/:date')
  @ApiQuery({ name: 'date', required: false })
  async excel(@Query('date') date: string, @Res() res: Response) {
    const exportPath = await this.historicAttendanceService.exportDataByDate(
      date,
    );

    fs.promises
      .stat(exportPath)
      .then((stat) => {
        if (stat.isFile()) {
          res.download(exportPath, 'attendance.xlsx', (err) => {
            if (err) {
              console.log(err);
            } else {
              fs.unlinkSync(exportPath);
            }
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post()
  async create(@Body() historicAttendanceDto: HistoricAttDto) {
    const allLevels = await this.levelService.findAll()
    const levelNames = allLevels.map(level => level?.name?.toLocaleLowerCase());
    if (levelNames.length === 0) throw new NotFoundException("No matching level found.")
    if (!levelNames.includes(historicAttendanceDto.level.toLocaleLowerCase())) {
      console.log("Level doesn't exist");
      throw new BadRequestException("Level doesn't exist")
    }

    if (!Object.values(AttendanceStatusEnum).includes(historicAttendanceDto.attendanceStatus)) {
      throw new BadRequestException('Invalid attendance status enum(Absent, Early, Late, Undefined)');
    }
    if (!Object.values(CheckOutStatusEnum).includes(historicAttendanceDto.checkOutStatus)) {
      throw new BadRequestException('Invalid checkout status enum(Leave_Early, Leave_On_Time, Undefined)');
    }

    historicAttendanceDto.attendanceStatus as AttendanceStatusEnum;
    historicAttendanceDto.checkOutStatus as CheckOutStatusEnum;
    return await this.historicAttendanceService.create(historicAttendanceDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.historicAttendanceService.delete(id);
  }
}
