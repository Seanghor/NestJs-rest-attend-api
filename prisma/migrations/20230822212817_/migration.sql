/*
  Warnings:

  - The `attendanceStatus` column on the `HistoricAtt` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `checkOutStatus` column on the `HistoricAtt` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "HistoricAtt" DROP COLUMN "attendanceStatus",
ADD COLUMN     "attendanceStatus" "AttendanceStatusEnum",
DROP COLUMN "checkOutStatus",
ADD COLUMN     "checkOutStatus" "CheckOutStatusEnum";
