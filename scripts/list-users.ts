
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function listUsers() {
    const users = await db.user.findMany();
    console.log("Users in DB:");
    users.forEach(u => console.log(`- ${u.email} (${u.role}) ID: ${u.id}`));
}

listUsers().finally(() => db.$disconnect());
