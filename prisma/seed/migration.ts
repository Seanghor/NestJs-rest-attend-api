// prisma/seed.ts
import { CheckOutStatusEnum, PrismaClient, UserRole } from '@prisma/client';
import * as  bcrypt from 'bcrypt'
import * as fs from 'fs'
import * as path from 'path'
const prisma = new PrismaClient();

const hashPassword = async (password: string) => {
    const saltRounds = process.env.saltOrRounds || 12; // Number of salt rounds
    const salt = await bcrypt.genSalt(+saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

async function migrateData() {

    //--1 migrate location:
    async function migrateLocation() {
        const rootPath = path.resolve(__dirname, '..')
        const exportPath = path.join(rootPath, '..', 'backup', 'old', 'location.json')

        console.log("exportPath:", exportPath);
        const data = fs.readFileSync(exportPath, 'utf8')
        const jsonData = JSON.parse(data)
        for (const location of jsonData) {
            console.log(location);

            const createLocation = await prisma.level.create({
                data: {
                    name: location.name
                }
            })
            console.table(createLocation)
        }

    }
    await migrateLocation()


    //--2 migrate user:
    async function migrateUsers() {
        const rootPath = path.resolve(__dirname, '..')
        const exportPath = path.join(rootPath, '..', 'backup', 'old', 'users.json')

        console.log("exportPath:", exportPath);
        const data = fs.readFileSync(exportPath, 'utf8')
        const jsonData = JSON.parse(data)
        for (const user of jsonData) {
            console.log(user);

            const createUser = await prisma.users.create({
                data: {
                    role: UserRole.STUDENT,
                    name: user.name,
                    faceString: user.faceString,
                    checkIn: user.checkIn,
                    checkOut: user.checkOut,
                    level: "string",
                    teacher: null,
                    fatherName: null,
                    fatherNumber: null,
                    fatherChatId: null,
                    motherName: null,
                    motherNumber: null,
                    motherChatId: null,
                    learningShift: null,
                }
            })
            console.table(createUser)
        }

    }
    await migrateUsers()

    //--3 migrate location:
    async function migrateAttendanceRule() {
        const rootPath = path.resolve(__dirname, '..')
        const exportPath = path.join(rootPath, '..', 'backup', 'old', 'attendanceRule.json')

        console.log("exportPath:", exportPath);
        const data = fs.readFileSync(exportPath, 'utf8')
        const jsonData = JSON.parse(data)
        console.log(jsonData[0]);

        for (const rule of jsonData) {
            // console.log(rule);

            const createAttendanceRule = await prisma.attendanceRule.create({
                data: {
                    id: rule.id,
                    earlyMinute: rule.earlyMinute,
                    lateMinute: rule.lateMinute,
                    offDutyTime: rule.offDutyTime,
                    onDutyTime: rule.onDutyTime
                }
            })
            console.table(createAttendanceRule)
        }
    }
    await migrateAttendanceRule()

    //--4 migrate attendance:
    async function migrateAttendance() {
        const defaultEmail = "hengratanakvisoth20@kit.edu.kh"
        const rootPath = path.resolve(__dirname, '..')
        const exportPath = path.join(rootPath, '..', 'backup', 'old', 'attendance.json')

        console.log("exportPath:", exportPath);
        const data = fs.readFileSync(exportPath, 'utf8')
        const jsonData = JSON.parse(data)

        const exportUserPath = path.join(rootPath, '..', 'backup', 'old', 'users.json')
        const user = fs.readFileSync(exportUserPath, 'utf8')
        const jsonUser = JSON.parse(user)

        for (const attendance of jsonData) {
            if (attendance.userEmail == null || attendance.userEmail == undefined || attendance.userEmail == "") {
                console.log("Eamil:", attendance.userEmail);
                attendance.userEmail = defaultEmail
            }

            const st = jsonUser.find((u) => u.email === attendance.userEmail)
            const user = await prisma.users.findFirst({
                where: {
                    name: st.name
                }
            })


            // console.log(user.name);
            const createAttendance = await prisma.attendances.create({
                data: {
                    date: attendance.date,
                    level: attendance.location,
                    time: attendance.time,
                    temperature: attendance.temperature,
                    userId: user.id,
                    name: user.name,
                    createdAt: attendance.createdAt
                }
            })
            console.table(createAttendance)

        }
        console.log("-------------------------- Attendance --------------------------");

    }
    await migrateAttendance()


    //--4 migrate attendance:
    async function migrateHistAttendance() {
        const defaultEmail = "hengratanakvisoth20@kit.edu.kh"
        const rootPath = path.resolve(__dirname, '..')
        const exportPath = path.join(rootPath, '..', 'backup', 'old', 'hist-attendance.json')

        console.log("exportPath:", exportPath);
        const data = fs.readFileSync(exportPath, 'utf8')
        const jsonData = JSON.parse(data)

        const exportUserPath = path.join(rootPath, '..', 'backup', 'old', 'users.json')
        const user = fs.readFileSync(exportUserPath, 'utf8')
        const jsonUser = JSON.parse(user)

        console.log(jsonData[0].ema);


        for (const hist of jsonData) {
            try {
                if (hist.userEmail == null || hist.userEmail == undefined || hist.userEmail == "") {
                    console.log("Eamil:", hist.userEmail);
                    hist.userEmail = defaultEmail
                }
                const st = jsonUser.find((u) => u.email === hist.userEmail)
                const user = await prisma.users.findFirst({
                    where: {
                        name: st.name
                    }
                })
                // console.log(user.name);
                const createHistAttendance = await prisma.historicAtt.create({
                    data: {
                        date: hist.date,
                        level: hist.location,
                        checkIn: hist.checkIn,
                        checkOut: hist.checkOut,
                        temperature: hist.temperature,
                        attendanceStatus: hist.attendanceStatus,
                        checkOutStatus: hist.checkOutStatus == "Leave Early" ? CheckOutStatusEnum.Leave_Early : hist.checkOutStatus == "Leave On Time" ? CheckOutStatusEnum.Leave_On_Time : CheckOutStatusEnum.Undefined,
                        userId: user.id,
                        name: user.name
                    }
                })
                console.table(createHistAttendance)
            } catch (error) {
                // Check if the error is related to the unique constraint violation
                if (error.code === 'P2002' && error.meta && error.meta.target.includes('date') && error.meta.target.includes('userId')) {
                    console.error("Skipped duplicate record:", error.message);
                } else {
                    console.error("An error occurred:", error);
                }
                continue; // Continue to the next iteration regardless of the error
            }
            console.log("-------------------------- Attendance --------------------------");

        }
        console.log("-------------------------- Hist Attendance --------------------------")

    }

    await migrateHistAttendance()


}



migrateData()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });