import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/profile/email-settings - Get user's email settings
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                email_provider: true,
                email_subject: true,
                email_body: true,
                email_signature: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching email settings:", error);
        return NextResponse.json({ error: "Failed to fetch email settings" }, { status: 500 });
    }
}

// PUT /api/profile/email-settings - Update user's email settings
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { email_provider, email_subject, email_body, email_signature } = body;

        // Validate email provider
        const validProviders = ["GMAIL", "OUTLOOK", "YAHOO", "ICLOUD", "PROTONMAIL"];
        if (email_provider && !validProviders.includes(email_provider)) {
            return NextResponse.json({ error: "Invalid email provider" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...(email_provider && { email_provider }),
                ...(email_subject !== undefined && { email_subject }),
                ...(email_body !== undefined && { email_body }),
                ...(email_signature !== undefined && { email_signature }),
            },
            select: {
                email_provider: true,
                email_subject: true,
                email_body: true,
                email_signature: true,
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating email settings:", error);
        return NextResponse.json({ error: "Failed to update email settings" }, { status: 500 });
    }
}

