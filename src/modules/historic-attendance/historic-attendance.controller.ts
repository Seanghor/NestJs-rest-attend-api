import { Controller, Get } from '@nestjs/common';
import { Body, Delete, Param, Post } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiTags } from '@nestjs/swagger';
import { HistoricAttDto } from './dto/historic-attendance.dto';
import { HistoricAttendanceService } from './historic-attendance.service';

@Controller('historic-attendance')
@ApiTags('historic-attendance')
export class HistoricAttendanceController {
  constructor(
    private readonly historicAttendanceService: HistoricAttendanceService,
  ) {}

  @Get()
  findAll() {
    return this.historicAttendanceService.findAll();
  }

  @Get('/location/:location')
  findAllByLocation(@Param('location') location: string) {
    return this.historicAttendanceService.findAllByLocation(location);
  }

  @Get('/date/:date')
  findAllByDate(@Param('date') date: string) {
    return this.historicAttendanceService.findAllByDate(date);
  }

  @Get(':date/:userEmail')
  findAllByDateAndEmail(
    @Param('date') date: string,
    @Param('userEmail') userEmail: string,
  ) {
    return this.historicAttendanceService.findAllByDateAndEmail(
      date,
      userEmail,
    );
  }

  @Get('/date/location/:date/:location')
  summaryByLocationDate(
    @Param('date') date: string,
    @Param('location') location: string,
  ) {
    return this.historicAttendanceService.summaryByLocationDate(date, location);
  }

  @Get(':userEmail')
  findAllByUserEmail(@Param('userEmail') userEmail: string) {
    return this.historicAttendanceService.findAllByUserEmail(userEmail);
  }

  @Get(':date/:userEmail')
  findOneByDateAndEmail(
    @Param('date') date: string,
    @Param('userEmail') userEmail: string,
  ) {
    return this.historicAttendanceService.findOneByDateAndEmail(
      date,
      userEmail,
    );
  }

  @Post()
  create(@Body() historicAttendanceDto: HistoricAttDto) {
    return this.historicAttendanceService.create(historicAttendanceDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.historicAttendanceService.delete(id);
  }
}
