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

        // Update conversation updated_at and get all members
        const conversation = await prisma.conversation.update({
            where: { id: conversationId },
            data: { updated_at: new Date() },
            include: {
                members: {
                    select: { user_id: true }
                }
            }
        });

        // Broadcast message to conversation channel
        await pusherServer.trigger(
            getConversationChannel(conversationId),
            "new-message",
            message
        );

        // Get all members except sender
        const otherMembers = conversation.members
            .filter((m: { user_id: string }) => m.user_id !== session.user.id)
            .map((m: { user_id: string }) => m.user_id);


        // Create notifications for all other members (new message notification)
        if (otherMembers.length > 0) {
            const messageNotifications = otherMembers.map((userId: string) => ({
                user_id: userId,
                type: "MESSAGE",
                title: `New message from ${session.user.name}`,
                body: content.substring(0, 100),
                data: JSON.stringify({ conversationId, messageId: message.id }),
            }));

            await prisma.notification.createMany({ data: messageNotifications });

            // Send real-time notification to each member
            for (const userId of otherMembers) {
                await pusherServer.trigger(`user-${userId}`, "new-message-notification", {
                    type: "MESSAGE",
                    senderName: session.user.name,
                    content: content.substring(0, 50),
                    conversationId,
                    messageId: message.id,
                });
            }
        }

        // Create additional notifications for mentioned users
        if (mentionedUserIds?.length) {
            const mentionNotifications = mentionedUserIds
                .filter((userId: string) => userId !== session.user.id)
                .map((userId: string) => ({
                    user_id: userId,
                    type: "MENTION",
                    title: `${session.user.name} mentioned you`,
                    body: content.substring(0, 100),
                    data: JSON.stringify({ conversationId, messageId: message.id }),
                }));

            if (mentionNotifications.length > 0) {
                await prisma.notification.createMany({ data: mentionNotifications });
            }

            // Notify each mentioned user
            for (const userId of mentionedUserIds) {
                if (userId !== session.user.id) {
                    await pusherServer.trigger(`user-${userId}`, "notification", {
                        type: "MENTION",
                        title: `${session.user.name} mentioned you`,
                        conversationId,
                    });
                }
            }
        }

        return NextResponse.json(message);
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}

