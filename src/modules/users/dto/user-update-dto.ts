import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UserUpdateDto {
    @IsString()
    @ApiProperty()
    @Optional()
    name: string;
  
    @IsString()
    @ApiProperty()
    @Optional()
    email: string;
  
    @IsString()
    @ApiProperty()
    @Optional()
    location: string;
  }
  