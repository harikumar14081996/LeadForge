
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
    console.log("Checking LeadStatus enum support...");
    try {
        // Find any lead to test with
        const lead = await db.lead.findFirst();
        if (!lead) {
            console.log("No leads found to test.");
            const newLead = await db.lead.create({
                data: {
                    company_id: "test", // Will likely fail if company doesn't exist, but let's try finding first
                    // Dummy data if needed, but lets rely on finding one
                    first_name: "Test", last_name: "Test", email: "test@test.com", phone: "123",
                    loan_type: "PERSONAL_LOAN",
                    employer_name: "test", position: "test", years_employed: 1, employer_phone: "123",
                    sin_full: "123", consent_given: true, consent_timestamp: new Date(),
                    street: "a", city: "a", province_state: "a", country: "a", postal_zip: "a"
                }
            });
            // If create fails due to relations, we'll know.
        } else {
            console.log(`Found lead ${lead.id} with status ${lead.status}`);
            console.log("Attempting to update status to 'UNASSIGNED'...");

            await db.lead.update({
                where: { id: lead.id },
                data: { status: 'UNASSIGNED' }
            });
            console.log("✅ Update to UNASSIGNED successful!");

            // Revert
            await db.lead.update({ where: { id: lead.id }, data: { status: 'UNASSIGNED' } });
            console.log("Reverted to UNASSIGNED.");
        }

    } catch (e: any) {
        console.error("❌ Update failed:", e.message);
    } finally {
        await db.$disconnect();
    }
}

main();
