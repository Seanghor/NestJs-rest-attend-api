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
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "faceString" TEXT NOT NULL,
    "checkIn" TEXT,
    "checkOut" TEXT,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendances" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TEXT,
    "temperature" TEXT,
    "status" TEXT,
    "location" TEXT,
    "time" TEXT,
    "userEmail" TEXT NOT NULL,

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
    "temperature" TEXT,
    "location" TEXT,
    "checkIn" TEXT,
    "checkOut" TEXT,
    "attendanceStatus" TEXT,
    "checkOutStatus" TEXT,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "HistoricAtt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SuperAdmin_email_key" ON "SuperAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HistoricAtt_date_userEmail_key" ON "HistoricAtt"("date", "userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "Location"("name");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "SuperAdmin"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendances" ADD CONSTRAINT "Attendances_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "Users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricAtt" ADD CONSTRAINT "HistoricAtt_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "Users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
