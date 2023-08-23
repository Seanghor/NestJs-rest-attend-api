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

            // const createAttendanceRule = await prisma.level.create({
            //     data: {
            //         name: location.name
            //     }
            // })
            // console.table(createLocation)
        }

    }
    // migrateLocation()
    // migrateUsers()
    migrateAttendanceRule()


}



migrateData()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });