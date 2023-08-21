import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserEntity as User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { RolesGuard } from 'src/auth/role.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorateor';
import { AuthGuard } from 'src/auth/auth.guard';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { LocationService } from '../location/location.service';


@Controller('users')
@ApiTags('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly userService: UsersService, private readonly locationService: LocationService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiCreatedResponse({ type: User })
  async create(@Body() userDto: UserDto) {
    if (!userDto.name) {
      throw new BadRequestException("name is required")
    }

    const face = userDto.faceString;
    const array = face.split(',');
    if (array.length !== 512) {
      throw new BadRequestException('The face string is not valid, must be 512 floats separated by commas');
    }
    return this.userService.create(userDto);
  }

  @Post('/bulk/create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiCreatedResponse({ type: User, isArray: true })
  async bulkCreate(@Body() userDto: UserDto[]) {
    return await this.userService.bulkCreate(userDto);
  }

  @Get('/paginated')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiQuery({ name: 'page', required: false })
  async findAllPaginated(@Query('page') page) {
    return await this.userService.findAllPaginated(page);
  }

  @Get('level/users')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiOkResponse({ type: User, isArray: true })
  async findAllByLevel(@Query('level') level: string) {
    return await this.userService.findAllByLevel(level);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiOkResponse({ type: User, isArray: true })
  async findAll() {
    // get all posts in the db
    return await this.userService.findAll();
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiOkResponse({ type: User })
  async deleteOne(@Param('id') id: string) {
    return await this.userService.deleteOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @ApiOkResponse({ type: User })
  async updateOneName(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('level') level: string,
    @Body('teacher') teacher: string,
    @Body('fatherName') fatherName: string,
    @Body('fatherNumber') fatherNumber: string,
    @Body('fatherChatId') fatherChatId: string,
    @Body('motherNumber') motherNumber: string,
    @Body('motherChatId') motherChatId: string,
  ) {
    const update = await this.userService.updateOneUser(id, {
      name,
      level,
      teacher,
      fatherNumber,
      fatherChatId,
      motherNumber,
      motherChatId,
    });
    return update;
  }


  
}
