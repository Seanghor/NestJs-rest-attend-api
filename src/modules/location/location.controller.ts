import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Delete, Patch, UseFilters } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiTags } from '@nestjs/swagger';
import { LocationDto } from './dto/location.dto';
import { LocationService } from './location.service';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorateor';

@Controller('location')
@UseFilters(HttpExceptionFilter)
@ApiTags('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  async create(@Body() location: LocationDto) {
    const existingName = await this.locationService.findOneByName(location.name)
    if (existingName) {
      throw new BadRequestException("Name already exist")
    }
    return this.locationService.create(location);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  findAll() {
    return this.locationService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  findOne(@Param('id') id: number) {
    return this.locationService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  update(@Param('id') id: number, @Body() location: LocationDto) {
    return this.locationService.update(id, location);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.delete(id);
  }
}
