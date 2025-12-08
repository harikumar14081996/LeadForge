
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const db = new PrismaClient();

async function checkUser(email: string, password: string) {
    console.log(`Checking user: ${email}`);
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
        console.log("❌ User NOT found in database.");
        return;
    }

    console.log("✅ User found:", {
        id: user.id,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
        is_active: user.is_active,
        password_hash_prefix: user.password_hash.substring(0, 10) + "..."
    });

    const match = await bcrypt.compare(password, user.password_hash);
    if (match) {
        console.log("✅ Password MATCHES hash.");
    } else {
        console.log("❌ Password does NOT match hash.");
    }
}

// Replace these with the credentials the user is trying
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const emailToCheck: any = process.argv[2];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const passwordToCheck: any = process.argv[3];

if (!emailToCheck || !passwordToCheck) {
    console.log("Usage: npx tsx scripts/debug-login.ts <email> <password>");
} else {
    checkUser(emailToCheck, passwordToCheck)
        .catch(e => console.error(e))
        .finally(async () => {
            await db.$disconnect();
        });
}

export { }; // Module scope
