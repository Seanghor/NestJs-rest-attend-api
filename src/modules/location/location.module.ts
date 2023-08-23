import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [LocationController],
  providers: [LocationService, PrismaService, JwtService],
})
export class LocationModule {}
