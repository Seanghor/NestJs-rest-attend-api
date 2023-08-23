import { Controller, UseGuards, Get, Post, Body, Patch, Param, Delete, UseFilters, NotFoundException } from '@nestjs/common';
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { RolesGuard } from 'src/auth/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorateor';
import { UserRole } from '@prisma/client';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { LevelEntity as Level } from './entities/level.entity';

@Controller('level')
@UseFilters(HttpExceptionFilter)
@ApiTags('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiCreatedResponse({ type: Level })
  async create(@Body() createLevelDto: CreateLevelDto) {
    return await this.levelService.create(createLevelDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiCreatedResponse({ type: Level, isArray: true })
  async findAll() {
    return await this.levelService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiCreatedResponse({ type: Level })
  async findOne(@Param('id') id: string) {
    const existing = await this.levelService.findOneById(+id);
    if (!existing) throw new NotFoundException(`Level with id ${id} not found`)
    return await this.levelService.findOneById(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiCreatedResponse({ type: Level })
  async update(@Param('id') id: string, @Body() updateLevelDto: UpdateLevelDto) {
    return await this.levelService.update(+id, updateLevelDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiCreatedResponse({ type: Level })
  async remove(@Param('id') id: string) {
    const existing = await this.levelService.findOneById(+id);
    if (!existing) throw new NotFoundException(`Level with id ${id} not found`)
    return await this.levelService.remove(+id);
  }

  @Delete()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiCreatedResponse({ })
  async deleteAll() {
    return await this.levelService.deleteAll()
  }
}
