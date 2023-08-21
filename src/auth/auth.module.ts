import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AdminsService } from 'src/modules/admins/admins.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminsModule } from 'src/modules/admins/admins.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { HashPasswordService } from 'src/modules/util/hashing-password';

@Module({
  imports: [
    AdminsModule,
    PassportModule,
    JwtModule.register({
      secret: 'random_secret_key',
      signOptions: { expiresIn: '48h' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    AdminsService,
    PrismaService,
    JwtStrategy,
    HashPasswordService
  ],
  controllers: [AuthController],
})
export class AuthModule {}
