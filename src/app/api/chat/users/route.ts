import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/chat/users - List company users for @mentions
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            where: {
                company_id: session.user.company_id,
                is_active: true,
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                avatar_url: true,
                role: true,
            },
            orderBy: { first_name: "asc" }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
