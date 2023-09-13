-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'STUDENT');

-- CreateEnum
CREATE TYPE "AttendanceStatusEnum" AS ENUM ('Absent', 'Early', 'Late', 'Undefined');

-- CreateEnum
CREATE TYPE "CheckOutStatusEnum" AS ENUM ('Leave_Early', 'Leave_On_Time', 'Undefined');

-- CreateTable
CREATE TABLE "SuperAdmin" (
    "id" SERIAL NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'SUPER_ADMIN',
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuperAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createBySuperAdminId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "name" TEXT NOT NULL,
    "faceString" TEXT NOT NULL,
    "checkIn" TEXT,
    "checkOut" TEXT,
    "level" TEXT,
    "teacher" TEXT,
    "fatherName" TEXT,
    "fatherNumber" TEXT,
    "fatherChatId" TEXT,
    "motherName" TEXT,
    "motherNumber" TEXT,
    "motherChatId" TEXT,
    "learningShift" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendances" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TEXT,
    "level" TEXT,
    "time" TEXT,
    "temperature" TEXT,
    "userId" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRule" (
    "id" SERIAL NOT NULL,
    "earlyMinute" TEXT,
    "lateMinute" TEXT,
    "offDutyTime" TEXT,
    "onDutyTime" TEXT,

    CONSTRAINT "AttendanceRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricAtt" (
    "id" SERIAL NOT NULL,
    "date" TEXT,
    "level" TEXT,
    "checkIn" TEXT,
    "checkOut" TEXT,
    "temperature" TEXT,
    "attendanceStatus" "AttendanceStatusEnum",
    "checkOutStatus" "CheckOutStatusEnum",
    "userId" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "HistoricAtt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "level_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SuperAdmin_email_key" ON "SuperAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HistoricAtt_date_userId_key" ON "HistoricAtt"("date", "userId");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_createBySuperAdminId_fkey" FOREIGN KEY ("createBySuperAdminId") REFERENCES "SuperAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendances" ADD CONSTRAINT "Attendances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricAtt" ADD CONSTRAINT "HistoricAtt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
