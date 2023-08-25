import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationService } from '../location/location.service';
import { AuthService } from 'src/auth/auth.service';
import { AdminsService } from '../admins/admins.service';
import { SuperAdminService } from '../super-admin/super-admin.service';
import { HashPasswordService } from '../util/hashing-password';
import { LevelService } from '../level/level.service';

@Module({
  providers: [UsersService, HashPasswordService, PrismaService, LocationService, AuthService,LevelService, AdminsService, SuperAdminService, LevelService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
