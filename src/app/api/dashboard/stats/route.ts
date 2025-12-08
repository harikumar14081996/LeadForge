import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfMonth, subDays, format } from "date-fns";
import { LeadStatus } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const companyId = session.user.company_id;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isAdmin = session.user.role === "ADMIN";

    try {
        const now = new Date();
        const firstDayOfMonth = startOfMonth(now);
        const thirtyDaysAgo = subDays(now, 30);

        // Concurrent queries for performance
        const [
            totalLeads,
            myLeads,
            unassignedLeads,
            leadsThisMonth,
            wonLeads,
            resubmittedLeads,
            leadsByStatus,
            leadsByLoanType,
            leadsByOwner,
            leadsOverTimeRaw
        ] = await Promise.all([
            prisma.lead.count({ where: { company_id: companyId } }),
            prisma.lead.count({ where: { company_id: companyId, current_owner_id: userId } }),
            prisma.lead.count({ where: { company_id: companyId, status: LeadStatus.UNASSIGNED } }),
            prisma.lead.count({ where: { company_id: companyId, created_at: { gte: firstDayOfMonth } } }),
            prisma.lead.count({ where: { company_id: companyId, status: LeadStatus.FUNDED } }),
            prisma.lead.count({ where: { company_id: companyId, application_count: { gt: 1 } } }),
            prisma.lead.groupBy({
                by: ["status"],
                where: { company_id: companyId },
                _count: { _all: true }
            }),
            prisma.lead.groupBy({
                by: ["loan_type"],
                where: { company_id: companyId },
                _count: { _all: true }
            }),
            prisma.lead.groupBy({
                by: ["current_owner_id"],
                where: { company_id: companyId },
                _count: { _all: true }
            }),
            // For line charts, we fetch last 30 days created_at and aggregate in code or use raw query.
            // Prisma groupBy with date truncation is tricky without raw query.
            // We'll fetch just created_at and process in JS for simplicity/portability or use raw if needed.
            // Fetching only dates is lightweight.
            prisma.lead.findMany({
                where: { company_id: companyId, created_at: { gte: thirtyDaysAgo } },
                select: { created_at: true, is_resubmission: true }
            })
        ]);

        // Process conversion rate
        const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0.0";

        // Process Leads Over Time (Last 30 days)
        const dailyData: Record<string, { new: number, resubmitted: number }> = {};

        // Initialize last 30 days with 0
        for (let i = 0; i < 30; i++) {
            const d = subDays(now, i);
            const key = format(d, 'yyyy-MM-dd');
            dailyData[key] = { new: 0, resubmitted: 0 };
        }

        leadsOverTimeRaw.forEach(lead => {
            const key = format(lead.created_at, 'yyyy-MM-dd');
            if (dailyData[key]) {
                if (lead.is_resubmission) {
                    dailyData[key].resubmitted++;
                } else {
                    dailyData[key].new++;
                }
            }
        });

        const leadsOverTime = Object.entries(dailyData)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, counts]) => ({
                date,
                New: counts.new,
                Resubmitted: counts.resubmitted
            }));

        return NextResponse.json({
            cards: {
                totalLeads,
                myLeads,
                unassignedLeads,
                leadsThisMonth,
                conversionRate,
                resubmittedLeads
            },
            charts: {
                leadsByStatus: leadsByStatus.map(g => ({ name: g.status, value: g._count._all })),
                leadsByLoanType: leadsByLoanType.map(g => ({ name: g.loan_type, value: g._count._all })),
                leadsByOwner: leadsByOwner.map(g => ({ ownerId: g.current_owner_id, value: g._count._all })), // need to join names or fetch users separate
                leadsOverTime
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
