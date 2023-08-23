
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CreateLevelDto {
    @IsString()
    @ApiProperty({ required: false })
    name: string;
}
