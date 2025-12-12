import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PATCH /api/chat/read - Mark messages as read and dismiss notifications
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { conversationId } = body;

        if (!conversationId) {
            return NextResponse.json({ error: "conversationId required" }, { status: 400 });
        }

        // Update last_read_at for the user's membership
        await prisma.conversationMember.updateMany({
            where: {
                conversation_id: conversationId,
                user_id: session.user.id,
            },
            data: {
                last_read_at: new Date(),
            }
        });

        // Mark all notifications for this conversation as read
        // Using raw query since Prisma JSON filtering is complex
        await prisma.$executeRaw`
            UPDATE "Notification" 
            SET read = true 
            WHERE user_id = ${session.user.id} 
            AND read = false 
            AND data::text LIKE ${'%' + conversationId + '%'}
        `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error marking as read:", error);
        return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
    }
}

