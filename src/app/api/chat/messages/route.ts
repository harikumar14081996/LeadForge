import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { pusherServer, getConversationChannel } from "@/lib/pusher";

const prisma = new PrismaClient();


// GET /api/chat/messages?conversationId=xxx
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get("conversationId");

        if (!conversationId) {
            return NextResponse.json({ error: "conversationId required" }, { status: 400 });
        }

        // Verify user is member of conversation
        const membership = await prisma.conversationMember.findUnique({
            where: {
                conversation_id_user_id: {
                    conversation_id: conversationId,
                    user_id: session.user.id,
                }
            }
        });

        if (!membership) {
            return NextResponse.json({ error: "Not a member" }, { status: 403 });
        }

        // Get messages
        const messages = await prisma.message.findMany({
            where: { conversation_id: conversationId },
            include: {
                sender: {
                    select: { id: true, first_name: true, last_name: true, avatar_url: true }
                },
                mentions: {
                    include: {
                        user: {
                            select: { id: true, first_name: true, last_name: true }
                        }
                    }
                }
            },
            orderBy: { created_at: "asc" },
            take: 100,
        });

        // Update last_read_at
        await prisma.conversationMember.update({
            where: { id: membership.id },
            data: { last_read_at: new Date() }
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

// POST /api/chat/messages - Send a message
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { conversationId, content, mentionedUserIds } = body;

        if (!conversationId || !content?.trim()) {
            return NextResponse.json({ error: "conversationId and content required" }, { status: 400 });
        }

        // Verify membership
        const membership = await prisma.conversationMember.findUnique({
            where: {
                conversation_id_user_id: {
                    conversation_id: conversationId,
                    user_id: session.user.id,
                }
            }
        });

        if (!membership) {
            return NextResponse.json({ error: "Not a member" }, { status: 403 });
        }

        // Create message with mentions
        const message = await prisma.message.create({
            data: {
                conversation_id: conversationId,
                sender_id: session.user.id,
                content: content.trim(),
                mentions: mentionedUserIds?.length ? {
                    create: mentionedUserIds.map((userId: string) => ({
                        user_id: userId,
                    }))
                } : undefined,
            },
            include: {
                sender: {
                    select: { id: true, first_name: true, last_name: true, avatar_url: true }
                },
                mentions: {
                    include: {
                        user: {
                            select: { id: true, first_name: true, last_name: true }
                        }
                    }
                }
            }
        });

        // Update conversation updated_at
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updated_at: new Date() }
        });

        // Broadcast message to conversation channel
        await pusherServer.trigger(
            getConversationChannel(conversationId),
            "new-message",
            message
        );

        // Create notifications for mentioned users
        if (mentionedUserIds?.length) {
            const notifications = mentionedUserIds.map((userId: string) => ({
                user_id: userId,
                type: "MENTION",
                title: `${session.user.name} mentioned you`,
                body: content.substring(0, 100),
                data: { conversationId, messageId: message.id },
            }));

            await prisma.notification.createMany({ data: notifications });

            // Notify each mentioned user
            for (const userId of mentionedUserIds) {
                await pusherServer.trigger(`private-user-${userId}`, "notification", {
                    type: "MENTION",
                    title: `${session.user.name} mentioned you`,
                    conversationId,
                });
            }
        }

        return NextResponse.json(message);
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
