import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UseGuards,
  Request,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { AdminDto } from './dto/admin.dto';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { RolesGuard } from 'src/auth/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorateor';
import { Role } from 'src/auth/role.enum';
import { UsersService } from '../users/users.service';
import { AdminEntity } from './entities/admin.entity';

@Controller('admins')
@ApiTags('admin')
@UseFilters(HttpExceptionFilter)
export class AdminsController {
  constructor(
    private readonly adminService: AdminsService,
    private readonly userService: UsersService
  ) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  async create(@Request() req, @Body() admin: AdminDto) {
    const payload = req.payload
    // console.log("Request:", payload);
    admin.createBySuperAdminId = payload.id
    const existingAdmin = await this.adminService.findOneByEmail(admin.email)
    if (existingAdmin) throw new BadRequestException("Email alread exist")
    if (!admin.username) throw new BadRequestException("username is required")
    if (!admin.password) throw new BadRequestException('password is required')
    if (admin.password && admin.password.length <= 5) throw new BadRequestException('Password must be greater or equal to 5')
    return await this.adminService.create(admin);
  }


  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll() {
    // console.log('Payload:', req.payload);
    const admins = await this.adminService.findAll();
    return admins.map(admin => new AdminEntity(admin))
  }


  @Get('/email/:email')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOneByEmail(@Param('email') email: string) {
    console.log('Email:', email);

    const foundEmail = await this.adminService.findOneByEmail(email);
    return new AdminEntity(foundEmail)
  }


  @Get('/id/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    const foundId = await this.adminService.findOneById(id);
    // console.log(foundId);
    return new AdminEntity(foundId)
  }
}
