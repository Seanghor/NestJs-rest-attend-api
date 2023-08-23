// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as  bcrypt from 'bcrypt'
const prisma = new PrismaClient();

const hashPassword = async (password: string) => {
    const saltRounds = process.env.saltOrRounds || 12; // Number of salt rounds
    const salt = await bcrypt.genSalt(+saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}


async function main() {
    console.table("----------- MIGRATING --------------");

}




main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });