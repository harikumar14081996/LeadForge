import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/reminders/[id]/recipients - Get recipient statuses (admin only)
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify user is admin
        if (session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        // Get the reminder with recipients
        const reminder = await prisma.reminder.findFirst({
            where: {
                id: params.id,
                company_id: session.user.company_id,
            },
            include: {
                creator: {
                    select: { id: true, first_name: true, last_name: true }
                },
                recipients: {
                    include: {
                        user: {
                            select: { id: true, first_name: true, last_name: true, email: true }
                        }
                    },
                    orderBy: { created_at: "asc" }
                }
            }
        });

        if (!reminder) {
            return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
        }

        // Calculate stats
        const stats = {
            total: reminder.recipients.length,
            done: reminder.recipients.filter(r => r.status === "DONE").length,
            dismissed: reminder.recipients.filter(r => r.status === "DISMISSED").length,
            pending: reminder.recipients.filter(r => r.status === "PENDING").length,
        };

        return NextResponse.json({ reminder, stats });
    } catch (error) {
        console.error("Error fetching reminder recipients:", error);
        return NextResponse.json({ error: "Failed to fetch recipients" }, { status: 500 });
    }
}
