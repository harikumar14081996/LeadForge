
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { action, password, isActive } = body;

    // Verify target user belongs to same company
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser || targetUser.company_id !== session.user.company_id) {
        return NextResponse.json({ error: "User not found or access denied" }, { status: 404 });
    }

    try {
        if (action === "toggle_status") {
            // Check if isActive matches request OR just toggle if not provided? 
            // Better to be explicit from UI.
            const updatedUser = await prisma.user.update({
                where: { id },
                data: { is_active: isActive }
            });
            return NextResponse.json({
                success: true,
                user: { id: updatedUser.id, is_active: updatedUser.is_active }
            });
        }

        else if (action === "reset_password") {
            if (!password || password.length < 6) {
                return NextResponse.json({ error: "Password must be at least 6 chars" }, { status: 400 });
            }
            const hash = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id },
                data: { password_hash: hash }
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("User management error:", error);
        return NextResponse.json({ error: "Operation failed" }, { status: 500 });
    }
}
