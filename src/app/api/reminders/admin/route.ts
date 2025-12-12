import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/reminders/admin - List all reminders created by admin (for admin page)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only admins can access this
        if (session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        // Get all reminders for this company
        const reminders = await prisma.reminder.findMany({
            where: {
                company_id: session.user.company_id,
            },
            include: {
                creator: {
                    select: { id: true, first_name: true, last_name: true }
                },
                _count: {
                    select: { recipients: true }
                }
            },
            orderBy: { created_at: "desc" },
        });

        return NextResponse.json(reminders);
    } catch (error) {
        console.error("Error fetching admin reminders:", error);
        return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 });
    }
}
