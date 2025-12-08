import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            funded_amount,
            admin_fee,
            ppsr_fee,
            discharge_amount,
            total_loan_amount,
            loan_payment_frequency,
            first_payment_date
        } = body;

        const updatedLead = await prisma.lead.update({
            where: { id: params.id },
            data: {
                funded_amount: funded_amount ? parseFloat(funded_amount) : null,
                admin_fee: admin_fee ? parseFloat(admin_fee) : null,
                ppsr_fee: ppsr_fee ? parseFloat(ppsr_fee) : null,
                discharge_amount: discharge_amount ? parseFloat(discharge_amount) : null,
                total_loan_amount: total_loan_amount ? parseFloat(total_loan_amount) : null,
                loan_payment_frequency: loan_payment_frequency || null,
                first_payment_date: first_payment_date ? new Date(first_payment_date) : null,
            }
        });

        return NextResponse.json({ success: true, lead: updatedLead });
    } catch (error) {
        console.error("Update funding error:", error);
        return NextResponse.json({ error: "Failed to update funding details" }, { status: 500 });
    }
}
