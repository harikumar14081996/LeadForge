import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/notifications - Get user's notifications
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const notifications = await prisma.notification.findMany({
            where: { user_id: session.user.id },
            orderBy: { created_at: "desc" },
            take: 50,
        });

        const unreadCount = await prisma.notification.count({
            where: { user_id: session.user.id, read: false }
        });

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { notificationIds, markAllRead } = body;

        if (markAllRead) {
            await prisma.notification.updateMany({
                where: { user_id: session.user.id, read: false },
                data: { read: true }
            });
        } else if (notificationIds?.length) {
            await prisma.notification.updateMany({
                where: {
                    id: { in: notificationIds },
                    user_id: session.user.id
                },
                data: { read: true }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating notifications:", error);
        return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
    }
}
