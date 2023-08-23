
import { UserRole, level } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
export class LevelEntity implements level {

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;


}
