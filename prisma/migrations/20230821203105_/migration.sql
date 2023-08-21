/*
  Warnings:

  - You are about to drop the column `location` on the `Attendances` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Attendances` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `Attendances` table. All the data in the column will be lost.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `Users` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Attendances` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendances" DROP CONSTRAINT "Attendances_userEmail_fkey";

-- DropIndex
DROP INDEX "Users_email_key";

-- AlterTable
ALTER TABLE "Attendances" DROP COLUMN "location",
DROP COLUMN "status",
DROP COLUMN "userEmail",
ADD COLUMN     "level" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
DROP COLUMN "email",
ADD COLUMN     "checkIn" TEXT,
ADD COLUMN     "checkOut" TEXT,
ADD COLUMN     "fatherChatId" TEXT,
ADD COLUMN     "fatherName" TEXT,
ADD COLUMN     "fatherNumber" TEXT,
ADD COLUMN     "learningShift" TEXT,
ADD COLUMN     "level" TEXT,
ADD COLUMN     "motherChatId" TEXT,
ADD COLUMN     "motherName" TEXT,
ADD COLUMN     "motherNumber" TEXT,
ADD COLUMN     "teacher" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Users_id_seq";

-- CreateTable
CREATE TABLE "SuperAdmin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuperAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricAtt" (
    "id" SERIAL NOT NULL,
    "date" TEXT,
    "level" TEXT,
    "checkIn" TEXT,
    "checkOut" TEXT,
    "temperature" TEXT,
    "attendanceStatus" TEXT,
    "checkOutStatus" TEXT,
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
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "SuperAdmin"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendances" ADD CONSTRAINT "Attendances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricAtt" ADD CONSTRAINT "HistoricAtt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
