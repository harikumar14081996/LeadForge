
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

// Hap's ID from previous step
const TARGET_USER_ID = "70feb2de-4efe-4be9-aeb4-3993c0834eef";

async function assignLead() {
    console.log("Finding a lead to assign...");
    const lead = await db.lead.findFirst();
    if (!lead) {
        console.log("No leads found.");
        return;
    }
    console.log(`Found Lead: ${lead.id} (Current Owner: ${lead.current_owner_id})`);

    console.log(`Assigning to User ID: ${TARGET_USER_ID}...`);

    try {
        const updated = await db.lead.update({
            where: { id: lead.id },
            data: {
                current_owner_id: TARGET_USER_ID,
                status: 'ATTEMPTED_TO_CONTACT'
            }
        });
        console.log("✅ Assignment Successful!");
        console.log(`New Owner: ${updated.current_owner_id}`);
        console.log(`New Status: ${updated.status}`);
    } catch (e) {
        console.error("❌ Assignment Failed:", e);
    }
}

assignLead().finally(() => db.$disconnect());
