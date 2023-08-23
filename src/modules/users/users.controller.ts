import { LevelService } from './../level/level.service';
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
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiBody,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserEntity as User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorateor';
import { AuthGuard } from 'src/auth/auth.guard';
import { HttpExceptionFilter } from 'src/model/http-exception.filter';
import { LocationService } from '../location/location.service';
import { UserRole } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseFilters, UseInterceptors } from '@nestjs/common/decorators';


@Controller('users')
@ApiTags('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly userService: UsersService, private readonly levelService: LevelService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiCreatedResponse({ type: User })
  async create(@Body() userDto: UserDto) {
    const allLevels = await this.levelService.findAll()
    const levelNames = allLevels.map(level => level?.name?.toLocaleLowerCase());
    if (levelNames.length === 0) throw new NotFoundException("No matching level found.")
    if (!levelNames.includes(userDto.level.toLocaleLowerCase())) {
      console.log("Level doesn't exist");
      throw new BadRequestException("Level doesn't exist")
    }
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
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiCreatedResponse({ type: User, isArray: true })
  async bulkCreate(@Body() userDto: UserDto[]) {
    return await this.userService.bulkCreate(userDto);
  }


  @Post('/json/register')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'JSON file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async registerJson(@UploadedFile() file) {
    const jsonData = await this.userService.readFromJson(file);
    console.log(jsonData);

    return 'Success';
  }

  @Get('/paginated')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiQuery({ name: 'page', required: false })
  async findAllPaginated(@Query('page') page: string) {
    const patternNumFormat = /^-?\d*\.?\d+$/;
    const isStringOfNumber = patternNumFormat.test(page);
    console.log('page IsNumber :', isStringOfNumber);
    if (!isStringOfNumber) throw new BadRequestException('page is not in string of number')
    return await this.userService.findAllPaginated(+page);
  }

  @Get('/v2')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOkResponse({ type: User, isArray: true })
  async findAllPage() {
    // get all posts in the db
    return await this.userService.findAllPage();
  }

  @Get('level/users')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOkResponse({ type: User, isArray: true })
  async findAllByLevel(@Query('level') level: string) {
    return await this.userService.findAllByLevel(level);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOkResponse({ type: User, isArray: true })
  async findAll() {
    // get all posts in the db
    return await this.userService.findAll();
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOkResponse({ type: User })
  async deleteOne(@Param('id') id: string) {
    const existingUser = await this.userService.findOne(id);
    if (!existingUser) throw new NotFoundException('User not found')
    return await this.userService.deleteOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOkResponse({ type: User })
  async updateOneName(
    @Param('id') id: string,
    @Body('faceString') faceString?: string,
    @Body('name') name?: string,
    @Body('level') level?: string,
    @Body('teacher') teacher?: string,
    @Body('fatherName') fatherName?: string,
    @Body('fatherNumber') fatherNumber?: string,
    @Body('fatherChatId') fatherChatId?: string,
    @Body('motherName') motherName?: string,
    @Body('motherNumber') motherNumber?: string,
    @Body('motherChatId') motherChatId?: string,
    @Body('learningShift') learningShift?: string,
    @Body('checkIn') checkIn?: string,
    @Body('checkOut') checkOut?: string,
  ) {
    const existingUser = await this.userService.findOne(id);
    if (!existingUser) throw new NotFoundException('This user not found')

    if (faceString && faceString.split(',').length !== 512) {
      throw new BadRequestException('The face string is not valid, must be 512 floats separated by commas');
    }
    const update = await this.userService.updateOneUser(id, {
      name,
      level,
      teacher,
      fatherName,
      fatherNumber,
      fatherChatId,
      motherName,
      motherNumber,
      motherChatId,
      learningShift,
      checkIn,
      checkOut
    });
    return update;
  }
}
