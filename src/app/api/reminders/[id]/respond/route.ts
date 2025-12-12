import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PATCH /api/reminders/[id]/respond - Respond to a reminder
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { status } = body; // "DONE" or "DISMISSED"

        if (!status || !["DONE", "DISMISSED"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        // Update the recipient status
        const recipient = await prisma.reminderRecipient.updateMany({
            where: {
                reminder_id: params.id,
                user_id: session.user.id,
            },
            data: {
                status,
                responded_at: new Date(),
            }
        });

        if (recipient.count === 0) {
            return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, status });
    } catch (error) {
        console.error("Error responding to reminder:", error);
        return NextResponse.json({ error: "Failed to respond to reminder" }, { status: 500 });
    }
}
