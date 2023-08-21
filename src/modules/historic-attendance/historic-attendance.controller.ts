import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Body, Delete, Param, Post, Query, UseFilters } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { HistoricAttDto } from './dto/historic-attendance.dto';
import { HistoricAttendanceService } from './historic-attendance.service';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorateor';
import * as fs from 'fs';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';

@Controller('historic-attendance')
@UseFilters(HttpExceptionFilter)
@ApiTags('historic-attendance')
export class HistoricAttendanceController {
  constructor(
    private readonly historicAttendanceService: HistoricAttendanceService,
  ) { }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiQuery({ name: 'page', required: false })
  async findAll(@Query('page') page) {
    return await this.historicAttendanceService.findAll(page);
  }


  @Get('/location/:location')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  findAllByLocation(@Param('location') location: string) {
    return this.historicAttendanceService.findAllByLocation(location);
  }

  @Get('/date/:date')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  findAllByDate(@Param('date') date: string) {
    return this.historicAttendanceService.findAllByDate(date);
  }

  @Get(':date/:userId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  findAllByDateAndEmail(
    @Param('date') date: string,
    @Param('userId') userId: string,
  ) {
    return this.historicAttendanceService.findAllByDateAndId(date, userId);
  }

  @Get('/location/date/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  findAllByLocationDateStatus(
    @Query('date') date?: string,
    @Query('level') level?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
  ) {
    if (date && location && status) {
      return this.historicAttendanceService.filterStatusByLevelDate(
        date,
        level,
        status,
        page,
      );
    } else if (date && level) {
      return this.historicAttendanceService.findAllByLevelDate(
        level,
        date,
        page,
      );
    } else {
      return this.historicAttendanceService.findAllByDate(date, page);
    }
  }

  @Get('/attendance/location/date/:date')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  summaryByLocationDate(@Param('date') date: string) {
    return this.historicAttendanceService.summaryByLocationDate(date);
  }

  @Get(':userId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  findAllByUserEmail(@Param('userId') userId: string) {
    return this.historicAttendanceService.findAllByUserId(userId);
  }

  @Get(':date/:userId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  findOneByDateAndEmail(
    @Param('date') date: string,
    @Param('userId') userId: string,
  ) {
    return this.historicAttendanceService.findOneByDateAndId(date, userId);
  }

  @Get('/attendance/excel/location/date')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'location', required: false })
  async excelByLocationDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('location') location: string,
    @Res() res: Response,
  ) {
    const exportPath =
      await this.historicAttendanceService.exportDataByLocationDateRange(
        startDate,
        endDate,
        location,
      );

    fs.promises
      .stat(exportPath)
      .then((stat) => {
        if (stat.isFile()) {
          res.download(exportPath, location + '.xlsx', (err) => {
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
  @Roles(Role.SuperAdmin, Role.Admin)
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
  @Roles(Role.SuperAdmin, Role.Admin)
  @Post()
  create(@Body() historicAttendanceDto: HistoricAttDto) {
    return this.historicAttendanceService.create(historicAttendanceDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.historicAttendanceService.delete(id);
  }
}
