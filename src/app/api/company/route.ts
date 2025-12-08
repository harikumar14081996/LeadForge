import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const company = await prisma.company.findUnique({
            where: { id: session.user.company_id }
        });

        if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

        return NextResponse.json({ company });
    } catch (error) {
        console.error("Failed to fetch company:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, email, phone, address, logo_url, default_admin_fee_percent } = body;

        // Basic validation
        if (!name || !email) {
            return NextResponse.json({ error: "Name and Email are required" }, { status: 400 });
        }

        const updatedCompany = await prisma.company.update({
            where: { id: session.user.company_id },
            data: {
                name,
                email,
                phone,
                address,
                logo_url,
                default_admin_fee_percent: default_admin_fee_percent ? Number(default_admin_fee_percent) : 0
            }
        });

        return NextResponse.json({ company: updatedCompany });
    } catch (error) {
        console.error("Failed to update company:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
