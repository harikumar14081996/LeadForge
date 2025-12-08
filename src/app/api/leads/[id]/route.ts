import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { LeadStatus, NoteType } from "@prisma/client";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const { status, ownerId } = await req.json(); // Accept status or ownerId update

    try {
        console.log(`[PATCH Leader] update for ${id}`, { status, ownerId });
        const lead = await prisma.lead.findUnique({ where: { id } });
        if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

        // Update Status
        if (status) {
            console.log("Updating status to", status);
            if (status === lead.status) return NextResponse.json({ success: true }); // No change

            await prisma.$transaction([
                prisma.lead.update({
                    where: { id },
                    data: { status: status as LeadStatus }
                }),
                prisma.note.create({
                    data: {
                        lead_id: id,
                        user_id: session.user.id,
                        type: NoteType.STATUS_CHANGE,
                        content: `Status changed from ${lead.status} to ${status}`
                    }
                })
            ]);
        }

        // Update Owner
        if (ownerId !== undefined) {
            if (ownerId === lead.current_owner_id) return NextResponse.json({ success: true });

            // Auto-update status from UNASSIGNED to CONNECTED (only if assigning to a user)
            let statusUpdate = undefined;
            if (ownerId && lead.status === "UNASSIGNED") {
                statusUpdate = "CONNECTED";
            }
            // If unassigning (ownerId is null), typically we might set status to UNASSIGNED or NEW? 
            // For now, let's leave status alone on unassign unless requested otherwise.

            const transactionOperations = [
                prisma.lead.update({
                    where: { id },
                    data: {
                        current_owner_id: ownerId,
                        ...(statusUpdate && { status: statusUpdate as LeadStatus })
                    }
                }),
                prisma.ownershipHistory.create({
                    data: {
                        lead_id: id,
                        performed_by_user_id: session.user.id,
                        from_user_id: lead.current_owner_id,
                        to_user_id: ownerId,
                        action_type: ownerId ? "ASSIGNED" : "RELEASED"
                    }
                }),
                prisma.note.create({
                    data: {
                        lead_id: id,
                        user_id: session.user.id,
                        type: NoteType.OWNERSHIP_CHANGE,
                        content: ownerId ? `Ownership transferred to new owner` : `Lead unassigned (released)`
                    }
                })
            ];

            if (statusUpdate) {
                transactionOperations.push(
                    prisma.note.create({
                        data: {
                            lead_id: id,
                            user_id: session.user.id,
                            type: NoteType.STATUS_CHANGE,
                            content: `Status automatically updated to CONNECTED upon assignment`
                        }
                    })
                );
            }

            await prisma.$transaction(transactionOperations);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Update failed:", error);
        return NextResponse.json({ error: "Update failed", details: String(error) }, { status: 500 });
    }
}
