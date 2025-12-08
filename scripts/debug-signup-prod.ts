
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function debugSignup() {
    console.log("Starting debug signup simulation...");
    const email = `test_debug_${Date.now()}@example.com`;
    const password = "password123";
    const companyName = "Debug Company";

    try {
        console.log(`Attempting to register: ${email}`);

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await prisma.$transaction(async (tx) => {
            console.log("Creating company...");
            const company = await tx.company.create({
                data: {
                    name: companyName,
                    email: email,
                    phone: "",
                },
            });
            console.log(`Company created: ${company.id}`);

            console.log("Creating user...");
            const user = await tx.user.create({
                data: {
                    company_id: company.id,
                    first_name: "Debug",
                    last_name: "User",
                    email: email,
                    password_hash: hashedPassword,
                    role: "ADMIN",
                },
            });
            console.log(`User created: ${user.id}`);
            return user;
        });

        console.log("✅ Signup simulation successful!");
        console.log("Created User ID:", result.id);

    } catch (error: any) {
        console.error("❌ Signup simulation failed!");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

debugSignup();
