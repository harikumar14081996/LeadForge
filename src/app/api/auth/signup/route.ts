import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

const signupSchema = z.object({
    first_name: z.string().min(2),
    last_name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    company_name: z.string().min(2),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = signupSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });
        if (existingUser) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Transaction to create company and admin
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await prisma.$transaction(async (tx: any) => {
            const company = await tx.company.create({
                data: {
                    name: validatedData.company_name,
                    email: validatedData.email, // Use admin email as company email for now or empty? Using admin email is safer
                    phone: "", // Default empty
                },
            });

            const user = await tx.user.create({
                data: {
                    company_id: company.id,
                    first_name: validatedData.first_name,
                    last_name: validatedData.last_name,
                    email: validatedData.email,
                    password_hash: hashedPassword,
                    role: "ADMIN",
                },
            });

            return user;
        });

        return NextResponse.json({ user: { id: result.id, email: result.email } });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "An error occurred during registration" },
            { status: 500 }
        );
    }
}
