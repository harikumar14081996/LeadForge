
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function checkMyLeads(email: string) {
    console.log(`Checking leads for owner email: ${email}`);

    // 1. Find User
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
        console.log("❌ User not found.");
        return;
    }
    console.log(`✅ Found User: ${user.first_name} ${user.last_name} (ID: ${user.id})`);

    // 2. Find Leads Assigned locally
    const leads = await db.lead.findMany({
        where: { current_owner_id: user.id },
        select: { id: true, first_name: true, last_name: true, status: true, current_owner_id: true }
    });

    console.log(`\nFound ${leads.length} leads assigned to this user:`);
    leads.forEach(l => {
        console.log(`- [${l.status}] ${l.first_name} ${l.last_name} (ID: ${l.id})`);
        console.log(`  Owner ID in DB: ${l.current_owner_id}`);
    });

    if (leads.length === 0) {
        console.log("⚠️ No leads found. If you assigned one in UI, it didn't save to DB.");
    }
}

const targetEmail = process.argv[2];
if (!targetEmail) {
    console.log("Usage: npx tsx scripts/debug-my-leads.ts <email>");
} else {
    checkMyLeads(targetEmail)
        .catch(console.error)
        .finally(() => db.$disconnect());
}
