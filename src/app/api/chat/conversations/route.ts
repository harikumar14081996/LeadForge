import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

// GET /api/chat/conversations - List user's conversations
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const conversations = await prisma.conversation.findMany({
            where: {
                members: {
                    some: { user_id: session.user.id }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                                avatar_url: true,
                                email: true,
                            }
                        }
                    }
                },
                messages: {
                    orderBy: { created_at: "desc" },
                    take: 1,
                    include: {
                        sender: {
                            select: { first_name: true, last_name: true }
                        }
                    }
                }
            },
            orderBy: { updated_at: "desc" }
        });

        // Calculate unread counts
        const enrichedConversations = conversations.map(conv => {
            const myMembership = conv.members.find(m => m.user_id === session.user.id);
            const lastReadAt = myMembership?.last_read_at || new Date(0);
            const lastMessage = conv.messages[0];
            const hasUnread = lastMessage && lastMessage.created_at > lastReadAt && lastMessage.sender_id !== session.user.id;

            return {
                ...conv,
                hasUnread,
                lastMessage: lastMessage || null,
            };
        });

        return NextResponse.json(enrichedConversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
    }
}

// POST /api/chat/conversations - Create new conversation (DM or Group)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { userIds, name, isGroup } = body;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json({ error: "userIds required" }, { status: 400 });
        }

        // For DMs, check if conversation already exists
        if (!isGroup && userIds.length === 1) {
            const existingConversation = await prisma.conversation.findFirst({
                where: {
                    is_group: false,
                    members: {
                        every: {
                            user_id: { in: [session.user.id, userIds[0]] }
                        }
                    },
                    AND: [
                        { members: { some: { user_id: session.user.id } } },
                        { members: { some: { user_id: userIds[0] } } }
                    ]
                },
                include: {
                    members: {
                        include: {
                            user: {
                                select: { id: true, first_name: true, last_name: true, avatar_url: true }
                            }
                        }
                    }
                }
            });

            if (existingConversation) {
                return NextResponse.json(existingConversation);
            }
        }

        // Create new conversation
        const memberIds = Array.from(new Set([session.user.id, ...userIds]));

        const conversation = await prisma.conversation.create({
            data: {
                company_id: session.user.company_id,
                name: isGroup ? name : null,
                is_group: isGroup || false,
                members: {
                    create: memberIds.map(userId => ({
                        user_id: userId,
                    }))
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, first_name: true, last_name: true, avatar_url: true }
                        }
                    }
                }
            }
        });

        // Notify all members via Pusher
        for (const memberId of memberIds) {
            await pusherServer.trigger(`private-user-${memberId}`, "new-conversation", conversation);
        }

        return NextResponse.json(conversation);
    } catch (error) {
        console.error("Error creating conversation:", error);
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
    }
}
