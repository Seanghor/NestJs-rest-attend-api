import { Controller, Get, Post, Res, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import * as fs from 'fs';
import { Response } from 'express';
// import path from 'node:path';
import * as path from 'path';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService,) { }

  @Post()
  create(@Body() createTestDto: CreateTestDto) {
    return this.testService.create(createTestDto);
  }

  @Get('/users')
  async findAllUser() {

    const rootPath = path.resolve(__dirname, '..', '..')
    const exportPath = path.join(rootPath, '..', '..', 'backup', 'users.json')
    const res = await this.testService.exportAllUser();
    const asyncUserData = JSON.stringify(res)
    console.log("exportPath:", exportPath);


    fs.writeFile(exportPath, asyncUserData, 'utf-8', (error) => {
      // 4
      if (error) {
        console.log(`WRITE ERROR: ${error}`)
      } else {
        // 5
        console.log('FILE WRITTEN TO:', exportPath)
      }
    })
    return res
  }

  @Get('/attendance')
  async findAllAttendance() {
    const rootPath = path.resolve(__dirname, '..', '..')
    const exportPath = path.join(rootPath, '..', '..', 'backup', 'attendance.json')
    const res = await this.testService.exportAllAttendance();
    const asyncUserData = JSON.stringify(res)
    console.log("exportPath:", exportPath);
    fs.writeFile(exportPath, asyncUserData, 'utf-8', (error) => {
      // 4
      if (error) {
        console.log(`WRITE ERROR: ${error}`)
      } else {
        // 5
        console.log('FILE WRITTEN TO:', exportPath)
      }
    })
    return res
  }

  @Get('/hist-attendance')
  async findAllHistAttendance() {
    const rootPath = path.resolve(__dirname, '..', '..')
    const exportPath = path.join(rootPath, '..', '..', 'backup', 'hist-attendance.json')
    const res = await this.testService.exportAllHistAttendance();
    const asyncUserData = JSON.stringify(res)
    console.log("exportPath:", exportPath);
    fs.writeFile(exportPath, asyncUserData, 'utf-8', (error) => {
      // 4
      if (error) {
        console.log(`WRITE ERROR: ${error}`)
      } else {
        // 5
        console.log('FILE WRITTEN TO:', exportPath)
      }
    })
    return res
  }


  @Get('/attendance-rule')
  async findAllAttendanceRule() {
    const rootPath = path.resolve(__dirname, '..', '..')
    const exportPath = path.join(rootPath, '..', '..', 'backup', 'attendanceRule.json')
    const res = await this.testService.exportAllAttendanceRule();
    const asyncUserData = JSON.stringify(res)
    console.log("exportPath:", exportPath);
    fs.writeFile(exportPath, asyncUserData, 'utf-8', (error) => {
      // 4
      if (error) {
        console.log(`WRITE ERROR: ${error}`)
      } else {
        // 5
        console.log('FILE WRITTEN TO:', exportPath)
      }
    })
    return res
  }


  @Get('/location')
  async findAllLocation() {
    const rootPath = path.resolve(__dirname, '..', '..')
    const exportPath = path.join(rootPath, '..', '..', 'backup', 'location.json')
    const res = await this.testService.exportAllLocation();
    const asyncUserData = JSON.stringify(res)
    console.log("exportPath:", exportPath);
    fs.writeFile(exportPath, asyncUserData, 'utf-8', (error) => {
      // 4
      if (error) {
        console.log(`WRITE ERROR: ${error}`)
      } else {
        // 5
        console.log('FILE WRITTEN TO:', exportPath)
      }
    })
    return res
  }

  @Get('/read')
  async read() {
    const rootPath = path.resolve(__dirname, '..', '..')
    const exportPath = path.join(rootPath, '..', '..', 'backup', 'attendanceRule.json')
    const data = fs.readFileSync(exportPath, 'utf8')
    const jsonData = JSON.parse(data)
    console.log(Object.keys(jsonData[0]))
    console.log(jsonData[0].date);

    // for (const rule of jsonData) {
    //   console.log(`Rule: ${JSON.stringify(rule)}`);
    // }

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testService.update(+id, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testService.remove(+id);
  }
}
