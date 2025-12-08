
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

const USER_ID = "e51379f9-73fa-41be-9cd6-ca82a8caf42b"; // hp@gmail.com

async function assign() {
    const lead = await db.lead.findFirst();
    if (lead) {
        console.log(`Assigning lead ${lead.id} to ${USER_ID}`);
        await db.lead.update({
            where: { id: lead.id },
            data: { current_owner_id: USER_ID, status: 'ASSIGNED' }
        });
        console.log("Done.");
    }
}

assign().finally(() => db.$disconnect());
