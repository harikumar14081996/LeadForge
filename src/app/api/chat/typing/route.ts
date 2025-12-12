import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer, getConversationChannel } from "@/lib/pusher";

// POST /api/chat/typing - Send typing indicator
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { conversationId, isTyping } = body;

        if (!conversationId) {
            return NextResponse.json({ error: "conversationId required" }, { status: 400 });
        }

        // Broadcast typing status to conversation channel
        await pusherServer.trigger(
            getConversationChannel(conversationId),
            "typing",
            {
                userId: session.user.id,
                userName: session.user.name,
                isTyping: isTyping ?? true,
            }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error sending typing indicator:", error);
        return NextResponse.json({ error: "Failed to send typing" }, { status: 500 });
    }
}
