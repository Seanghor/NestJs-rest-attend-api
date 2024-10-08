import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Body, Delete, Param, Post, Query } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { HistoricAttDto } from './dto/historic-attendance.dto';
import { HistoricAttendanceService } from './historic-attendance.service';
import { Response } from 'express';
import * as fs from 'fs';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorateor';

@Controller('historic-attendance')
@ApiTags('historic-attendance')
export class HistoricAttendanceController {
  constructor(
    private readonly historicAttendanceService: HistoricAttendanceService,
  ) { }

  @Get()
  async findAll() {
    // return await this.historicAttendanceService.findAll();
  }

  @Get('/v2')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  async findAllPage() {
    console.log("Running ....")
    return await this.historicAttendanceService.findAllPage();
  }

  @Get('/location/:location')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  async findAllByLocation(@Param('location') location: string) {
    return await this.historicAttendanceService.findAllByLocation(location);
  }

  @Get('/date/:date')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  async findAllByDate(@Param('date') date: string) {
    return await this.historicAttendanceService.findAllByDate(date);
  }

  @Get(':date/:userEmail')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  async findAllByDateAndEmail(
    @Param('date') date: string,
    @Param('userEmail') userEmail: string,
  ) {
    console.log("date:", date);
    console.log("userEmail:", userEmail);


    return await this.historicAttendanceService.findAllByDateAndEmail(
      date,
      userEmail,
    );
  }

  @Get('/location/date/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiQuery({ name: 'date', required: false, })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAllByLocationDateStatus(
    @Query('date') date?: string,
    @Query('location') location?: string,
    @Query('status') status?: string,
  ) {
    console.log(">> Running ....")
    location = !location ? null : location;
    date = !date ? null : date;
    status = !status ? null : status;
    const res = await this.historicAttendanceService.findAll(date, location, status);
    return { data: res }

  }

  @Get('/location/date/status/v2')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAllByLocationDateStatusPagination(
    @Query('date') date?: string,
    @Query('location') location?: string,
    @Query('status') status?: string,
  ) {
    ;

    if (date && location && status) {
      return this.historicAttendanceService.filterStatusByLocationDatePage(
        date,
        location,
        status,
      );
    } else if (date && location) {
      return this.historicAttendanceService.findAllByLocationDatePage(
        location,
        date,
      );
    } else if (date && status) {
      return this.historicAttendanceService.findAllByDateStatusPage(
        date,
        status,
      );
    } else if (location && status) {
      return this.historicAttendanceService.findAllByLocationStatusPage(
        location,
        status,
      );
    } else {
      return this.historicAttendanceService.findAllByDatePage(date);
    }
  }

  @Get('/attendance/location/date/:date')
  summaryByLocationDate(@Param('date') date: string) {
    return this.historicAttendanceService.summaryByLocationDate(date);
  }

  @Get(':userEmail')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  findAllByUserEmail(@Param('userEmail') userEmail: string) {
    return this.historicAttendanceService.findAllByUserEmail(userEmail);
  }

  @Get(':date/:userEmail')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  findOneByDateAndEmail(
    @Param('date') date: string,
    @Param('userEmail') userEmail: string,
  ) {

    return this.historicAttendanceService.findOneByDateAndEmail(
      date,
      userEmail,
    );
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
          res.download(exportPath,  'attendance.xlsx', (err) => {
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

  @Get('/attendance/excel/:date')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiQuery({ name: 'date', required: false })
  async excel(@Query('date') date: string, @Res() res: Response) {
    console.log(">>Export by date Running ....");

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

  @Get('/attendance/excel/month/location')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.SuperAdmin, Role.Admin)
  @ApiQuery({ name: 'month', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'year', required: false })
  async excelByMonthLocation(
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('location') location: string,
    @Res() res: Response,
  ) {
    const exportPath =
      await this.historicAttendanceService.exportDataByLocationMonth(
        month,
        year,
        location,
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

  @Get('/odoo/attendance')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  @ApiQuery({ name: 'users', required: true })
  async odooAttendance(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('users') users: string[],
    @Res() res: Response,
  ) {
    const exportPath =
      await this.historicAttendanceService.exportDataByDateRangeUsers(
        startDate,
        endDate,
        users,
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

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  create(@Body() historicAttendanceDto: HistoricAttDto) {
    return this.historicAttendanceService.create(historicAttendanceDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.historicAttendanceService.delete(id);
  }


  @Get('/attendance/each-location/date')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiQuery({ name: 'date', required: false, })
  async summaryAttendanceOfEachLocation(
    @Query('date') date: string,
  ) {
    console.log(">> Running ....", { date: date });
    const res = await this.historicAttendanceService.getSummaryByEachLocation(date);
    return { data: res }
  }

}
