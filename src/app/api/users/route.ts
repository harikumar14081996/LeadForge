import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const users = await prisma.user.findMany({
            where: { company_id: session.user.company_id },
            orderBy: { created_at: "desc" },
            select: { id: true, first_name: true, last_name: true, email: true, role: true, created_at: true }
        });
        return NextResponse.json({ users });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { firstName, lastName, email, password, role } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !password || !role) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                company_id: session.user.company_id,
                first_name: firstName,
                last_name: lastName,
                email,
                password_hash: hash,
                role: role as Role
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password_hash, ...safeUser } = user;
        return NextResponse.json({ success: true, user: safeUser });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to create user. Email might exist." }, { status: 500 });
    }
}
