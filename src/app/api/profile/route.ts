import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                avatar_url: true,
                role: true
            }
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { firstName, lastName, email, tempPassword, avatarUrl } = body;

        // Basic validation
        if (!firstName || !lastName || !email) {
            return NextResponse.json({ error: "First Name, Last Name and Email are required" }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = {
            first_name: firstName,
            last_name: lastName,
            email,
            avatar_url: avatarUrl
        };

        if (tempPassword && tempPassword.trim() !== "") {
            const hash = await bcrypt.hash(tempPassword, 10);
            data.password_hash = hash;
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data,
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                avatar_url: true,
                role: true
            }
        });

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error("Failed to update profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
