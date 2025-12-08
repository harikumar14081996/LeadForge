import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfWeek, startOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const companyId = session.user.company_id;
        const { searchParams } = new URL(request.url);

        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const period = searchParams.get("period"); // Keep for fallback or explicit shortcuts if needed in future

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let dateFilter: any = {};
        const now = new Date();

        if (startDate && endDate) {
            dateFilter = {
                created_at: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            };
        } else if (period === "week") {
            dateFilter = { created_at: { gte: startOfWeek(now, { weekStartsOn: 1 }) } };
        } else if (period === "month") {
            dateFilter = { created_at: { gte: startOfMonth(now) } };
        }

        // 1. Overall Company Stats
        const leadCounts = await prisma.lead.groupBy({
            by: ['status'],
            where: {
                company_id: companyId,
                ...dateFilter
            },
            _count: { _all: true }
        });

        const stats = {
            total: 0,
            funded: 0,
            approved: 0,
            declined: 0,
            qualified: 0,
            unqualified: 0,
            connected: 0,
            unassigned: 0,
        };

        leadCounts.forEach(group => {
            const count = group._count._all;
            stats.total += count;
            if (group.status === 'FUNDED') stats.funded = count;
            else if (group.status === 'APPROVED') stats.approved = count;
            else if (group.status === 'DECLINED') stats.declined = count;
            else if (group.status === 'QUALIFIED') stats.qualified = count;
            else if (group.status === 'UNQUALIFIED') stats.unqualified = count;
            else if (group.status === 'CONNECTED') stats.connected = count;
            else if (group.status === 'UNASSIGNED') stats.unassigned = count;
        });

        // 2. Loan Officer Performance
        const officers = await prisma.user.findMany({
            where: { company_id: companyId },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                role: true,
            }
        });

        const leadsByOwnerAndStatus = await prisma.lead.groupBy({
            by: ['current_owner_id', 'status'],
            where: {
                company_id: companyId,
                current_owner_id: { not: null },
                ...dateFilter
            },
            _count: { _all: true }
        });

        const officerStats = officers.map(officer => {
            const officerGroups = leadsByOwnerAndStatus.filter(g => g.current_owner_id === officer.id);

            // Calculate totals from the query result filtered by date
            const totalAssigned = officerGroups.reduce((acc, curr) => acc + curr._count._all, 0);

            const funded = officerGroups.find(g => g.status === 'FUNDED')?._count._all || 0;
            const approved = officerGroups.find(g => g.status === 'APPROVED')?._count._all || 0;
            const declined = officerGroups.find(g => g.status === 'DECLINED')?._count._all || 0;
            const unqualified = officerGroups.find(g => g.status === 'UNQUALIFIED')?._count._all || 0;
            const contacted = officerGroups.find(g => g.status === 'ATTEMPTED_TO_CONTACT' || g.status === 'CONNECTED')?._count._all || 0;

            // Calculate Success Rate (Funded / Total Assigned)
            const successRate = totalAssigned > 0 ? ((funded / totalAssigned) * 100).toFixed(1) : "0.0";

            return {
                id: officer.id,
                name: `${officer.first_name} ${officer.last_name}`,
                role: officer.role,
                totalAssigned,
                funded,
                approved,
                declined,
                unqualified,
                contacted,
                successRate
            };
        });

        // 3. Financials & Funded Leads
        const fundedLeads = await prisma.lead.findMany({
            where: {
                company_id: companyId,
                status: 'FUNDED',
                ...dateFilter
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                funded_amount: true,
                admin_fee: true,
                ppsr_fee: true,
                total_loan_amount: true,
                first_payment_date: true,
                current_owner: {
                    select: {
                        first_name: true,
                        last_name: true
                    }
                }
            },
            orderBy: {
                updated_at: 'desc'
            }
        });

        const totalFundedVolume = fundedLeads.reduce((sum, lead) => {
            return sum + (Number(lead.funded_amount) || 0);
        }, 0);

        const totalRevenue = fundedLeads.reduce((sum, lead) => {
            return sum + (Number(lead.admin_fee) || 0) + (Number(lead.ppsr_fee) || 0);
        }, 0);

        return NextResponse.json({
            companyStats: stats,
            officerStats: officerStats,
            financials: {
                totalFundedVolume,
                totalRevenue
            },
            fundedLeads: fundedLeads.map(lead => ({
                id: lead.id,
                clientName: `${lead.first_name} ${lead.last_name}`,
                fundedAmount: Number(lead.funded_amount) || 0,
                fees: (Number(lead.admin_fee) || 0) + (Number(lead.ppsr_fee) || 0),
                totalLoan: Number(lead.total_loan_amount) || 0,
                officerName: lead.current_owner ? `${lead.current_owner.first_name} ${lead.current_owner.last_name}` : 'Unassigned',
                date: lead.first_payment_date
            }))
        });

    } catch (error) {
        console.error("Reports API Error:", error);
        return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }
}
