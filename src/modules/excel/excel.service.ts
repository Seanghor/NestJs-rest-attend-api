import { Injectable, NotFoundException } from '@nestjs/common';
import { Workbook } from 'exceljs';
import * as path from 'path';
// import path from 'path';


interface Historic {
  id: number;
  date: string;
  temperature: string;
  location: string;
  checkIn: string;
  checkOut: string;
  attendanceStatus: string;
  checkOutStatus: string;
  userEmail: string;
}

@Injectable()
export class ExcelService {
  async dowloadExcel(data: Historic[]): Promise<string> {
    if (!data) {
      throw new NotFoundException('No data found');
    }
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Check In', key: 'checkIn', width: 20 },
      { header: 'Check Out', key: 'checkOut', width: 20 },
      { header: 'Attendance Status', key: 'attendanceStatus', width: 20 },
      { header: 'Check Out Status', key: 'checkOutStatus', width: 20 },
      { header: 'User Email', key: 'userEmail', width: 20 },
    ];
    for (const item of data) {
      worksheet.addRow({
        ...item,
      });
    }

    const exportPath = path.resolve(__dirname, 'attendance.xlsx');
    await workbook.xlsx.writeFile(exportPath);
    return exportPath;
  }

  async downloadExcelByLocation(
    data: Historic[],
    location: string,
  ): Promise<string> {
    if (!data) {
      throw new NotFoundException('No data found');
    }
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(location);

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 30 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Total', key: 'total', width: 10 },
      { header: 'Late', key: 'late', width: 10 },
      { header: 'Absent', key: 'absent', width: 10 },
      { header: 'Percentage', key: 'percentage', width: 10 },
    ];

    for (const item of data) {
      worksheet.addRow({
        ...item,
      });
    }

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC000' },
      };
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
    });

    // console.log('path:', path);
    
    const exportPath = path.resolve(__dirname, location + '.xlsx');
    await workbook.xlsx.writeFile(exportPath);
    return exportPath;
  }

  async downloadExcelByDateRange(data: Historic[]): Promise<string> {
    if (!data) {
      throw new NotFoundException('No data found');
    }
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 30 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Total', key: 'total', width: 10 },
      { header: 'Late', key: 'late', width: 10 },
      { header: 'Absent', key: 'absent', width: 10 },
      { header: 'Percentage', key: 'percentage', width: 10 },
    ];

    for (const item of data) {
      worksheet.addRow({
        ...item,
      });
    }

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC000' },
      };
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
    });

    const exportPath = path.resolve(__dirname, +'Attendance' + '.xlsx');
    await workbook.xlsx.writeFile(exportPath);
    return exportPath;
  }

  async downloadExcelByMonthAndLocation(
    data: Historic[],
    location: string,
  ): Promise<string> {
    if (!data) {
      throw new NotFoundException('No data found');
    }
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(location);

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 30 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Total', key: 'total', width: 10 },
      { header: 'Late', key: 'late', width: 10 },
      { header: 'Absent', key: 'absent', width: 10 },
      { header: 'Percentage', key: 'percentage', width: 10 },
    ];

    for (const item of data) {
      worksheet.addRow({
        ...item,
      });
    }

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC000' },
      };
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
    });

    const exportPath = path.resolve(__dirname,   'attendance.xlsx');
    await workbook.xlsx.writeFile(exportPath);
    return exportPath;
  }

  // -------------------------------------------------------
  async downloadExcelAllUsers(
    data: Historic[]
  ): Promise<string> {
    if (!data) {
      throw new NotFoundException('No data found');
    }
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("users");

    worksheet.columns = [
      { header: 'Id', key: 'id', width: 7 },
      { header: 'Name', key: 'name', width: 15 },
      { header: 'Role', key: 'role', width: 7 },
      { header: 'FaceString', key: 'faceString', width: 30 },
      { header: 'CheckIn', key: 'checkIn', width: 10 },
      { header: 'Checkout', key: 'checkout', width: 10 },
      { header: 'Level', key: 'level', width: 10 },
      { header: 'Teacher', key: 'teacher', width: 10 },
      { header: 'FatherName', key: 'fatherName', width: 10 },
      { header: 'FatherNumber', key: 'fatherNumber', width: 10 },
      { header: 'FatherChatId', key: 'fatherChatId', width: 10 },
      { header: 'MotherName', key: 'motherName', width: 10 },
      { header: 'MotherNumber', key: 'motherNumber', width: 10 },
      { header: 'MotherChatId', key: 'motherChatId', width: 10 },
      { header: 'LearningShift', key: 'learningShift', width: 10 },
      { header: 'CreatedAt', key: 'createdAt', width: 10 },

    ];

    for (const item of data) {
      worksheet.addRow({
        ...item,
      });
    }

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC000' },
      };
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
    });

    const exportPath = path.resolve(__dirname,  'user.xlsx');
    console.log("exportPath:",exportPath);
    
    await workbook.xlsx.writeFile(exportPath);
    return exportPath;
  }
}
