import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { pusherServer } from "@/lib/pusher";

const prisma = new PrismaClient();

// GET /api/reminders - List reminders for current user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get pending reminders for this user
        const reminders = await prisma.reminderRecipient.findMany({
            where: {
                user_id: session.user.id,
                status: "PENDING",
                reminder: {
                    is_active: true,
                }
            },
            include: {
                reminder: {
                    include: {
                        creator: {
                            select: { id: true, first_name: true, last_name: true }
                        }
                    }
                }
            },
            orderBy: { created_at: "desc" },
        });

        return NextResponse.json(reminders);
    } catch (error) {
        console.error("Error fetching reminders:", error);
        return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 });
    }
}

// POST /api/reminders - Create a reminder
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            title,
            content,
            type,
            scheduledAt,
            isRecurring,
            recurrence,
            daysOfWeek,
            timeOfDay
        } = body;

        if (!title || !content) {
            return NextResponse.json({ error: "Title and content required" }, { status: 400 });
        }

        // Only admins can create company-wide reminders
        // Loan officers can only create personal reminders
        if (type === "COMPANY_WIDE" && session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Only admins can create company-wide announcements" }, { status: 403 });
        }

        // Create the reminder with recurrence options
        const reminder = await prisma.reminder.create({
            data: {
                company_id: session.user.company_id,
                creator_id: session.user.id,
                type: session.user.role === "ADMIN" ? (type || "COMPANY_WIDE") : "PERSONAL",
                title,
                content,
                scheduled_at: scheduledAt ? new Date(scheduledAt) : null,
                is_recurring: isRecurring || false,
                recurrence: isRecurring ? recurrence : null,
                days_of_week: isRecurring && recurrence === "SPECIFIC_DAYS" ? daysOfWeek : null,
                time_of_day: timeOfDay || null,
            }
        });


        // Create recipients
        if (type === "COMPANY_WIDE") {
            // Get all users in the company
            const companyUsers = await prisma.user.findMany({
                where: {
                    company_id: session.user.company_id,
                    is_active: true,
                },
                select: { id: true }
            });

            // Create recipient entries for all users
            await prisma.reminderRecipient.createMany({
                data: companyUsers.map(user => ({
                    reminder_id: reminder.id,
                    user_id: user.id,
                }))
            });

            // Send real-time notification to all users
            for (const user of companyUsers) {
                await pusherServer.trigger(`user-${user.id}`, "new-reminder", {
                    id: reminder.id,
                    title: reminder.title,
                    content: reminder.content,
                    creatorName: session.user.name,
                    type: "COMPANY_WIDE",
                });
            }
        } else {
            // Personal reminder - only for the creator
            await prisma.reminderRecipient.create({
                data: {
                    reminder_id: reminder.id,
                    user_id: session.user.id,
                }
            });

            // Send notification to self
            await pusherServer.trigger(`user-${session.user.id}`, "new-reminder", {
                id: reminder.id,
                title: reminder.title,
                content: reminder.content,
                type: "PERSONAL",
            });
        }

        return NextResponse.json(reminder);
    } catch (error) {
        console.error("Error creating reminder:", error);
        return NextResponse.json({ error: "Failed to create reminder" }, { status: 500 });
    }
}
