import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NoteType } from "@prisma/client";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const { content } = await req.json();

    if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });

    try {
        const note = await prisma.note.create({
            data: {
                lead_id: id,
                user_id: session.user.id,
                content,
                type: NoteType.NOTE
            },
            include: {
                user: {
                    select: { first_name: true, last_name: true }
                }
            }
        });

        return NextResponse.json({ success: true, note });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: "Failed to add note" }, { status: 500 });
    }
}
