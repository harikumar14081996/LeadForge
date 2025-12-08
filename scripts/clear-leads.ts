
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function clearLeads() {
    console.log("Clearing all leads to prepare for Schema changes...");
    await db.note.deleteMany({});
    await db.ownershipHistory.deleteMany({});
    await db.lead.deleteMany({});
    console.log("✅ All leads cleared.");
}

clearLeads().finally(() => db.$disconnect());
