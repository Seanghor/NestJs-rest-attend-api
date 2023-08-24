// prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client';
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

    //--4 migrate attendance:
    async function migrateAttendance() {
        const rootPath = path.resolve(__dirname, '..')
        const exportPath = path.join(rootPath, '..', 'backup', 'old', 'attendance.json')

        console.log("exportPath:", exportPath);
        const data = fs.readFileSync(exportPath, 'utf8')
        const jsonData = JSON.parse(data)

        const exportUserPath = path.join(rootPath, '..', 'backup', 'old', 'users.json')
        const user = fs.readFileSync(exportUserPath, 'utf8')
        const jsonUser = JSON.parse(user)
        // console.log(jsonData[0]);
        console.log(jsonUser[0]);


        for (const attendance of jsonData) {
            const st = jsonUser.find((u) => u.email === attendance.userEmail)
            // console.log(st);
            
            // console.log(st.email);
            // const user = await prisma.users.findUnique()

            // const createAttendanceRule = await prisma.attendanceRule.create({
            //     data: {
            //         id: rule.id,
            //         earlyMinute: rule.earlyMinute,
            //         lateMinute: rule.lateMinute,
            //         offDutyTime: rule.offDutyTime,
            //         onDutyTime: rule.onDutyTime
            //     }
            // })
            // console.table(createAttendanceRule)
        }
    }
    // migrateLocation()
    // migrateUsers()
    // migrateAttendanceRule()
    migrateAttendance()


}



migrateData()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });