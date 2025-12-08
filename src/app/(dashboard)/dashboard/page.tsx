import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfMonth, subDays, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { Users, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import { LeadStatus } from "@prisma/client";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const companyId = session.user.company_id;
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);
    const thirtyDaysAgo = subDays(now, 30);

    // Stats Query
    const [
        totalLeads,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _myLeadsCount, // Keep for future use if needed, but underscore to silence
        unassignedCount,
        leadsThisMonth,
        wonLeads,
        resubmittedCount,
        leadsByStatus,
        leadsByLoanType,
        leadsOverTimeRaw
    ] = await Promise.all([
        prisma.lead.count({ where: { company_id: companyId } }),
        prisma.lead.count({ where: { company_id: companyId, current_owner_id: session.user.id } }),
        prisma.lead.count({ where: { company_id: companyId, status: LeadStatus.UNASSIGNED } }),
        prisma.lead.count({ where: { company_id: companyId, created_at: { gte: firstDayOfMonth } } }),
        prisma.lead.count({ where: { company_id: companyId, status: LeadStatus.FUNDED } }),
        prisma.lead.count({ where: { company_id: companyId, application_count: { gt: 1 } } }),
        prisma.lead.groupBy({ by: ["status"], where: { company_id: companyId }, _count: { _all: true } }),
        prisma.lead.groupBy({ by: ["loan_type"], where: { company_id: companyId }, _count: { _all: true } }),
        prisma.lead.findMany({
            where: { company_id: companyId, created_at: { gte: thirtyDaysAgo } },
            select: { created_at: true, is_resubmission: true }
        })
    ]);

    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0.0";

    // Process Charts Data
    const dailyData: Record<string, { new: number, resubmitted: number }> = {};
    for (let i = 0; i < 30; i++) {
        const d = subDays(now, i);
        const key = format(d, 'yyyy-MM-dd');
        dailyData[key] = { new: 0, resubmitted: 0 };
    }
    leadsOverTimeRaw.forEach(lead => {
        const key = format(lead.created_at, 'yyyy-MM-dd');
        if (dailyData[key]) {
            if (lead.is_resubmission) dailyData[key].resubmitted++;
            else dailyData[key].new++;
        }
    });
    const leadsOverTime = Object.entries(dailyData)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, counts]) => ({ date: format(new Date(date), "MMM d"), New: counts.new, Resubmitted: counts.resubmitted }));

    const chartData = {
        leadsByStatus: leadsByStatus.map(g => ({ name: g.status.replace(/_/g, " "), value: g._count._all })),
        leadsByLoanType: leadsByLoanType.map(g => ({ name: g.loan_type.replace(/_/g, " "), value: g._count._all })),
        leadsOverTime
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your company&apos;s lead performance</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLeads}</div>
                        <p className="text-xs text-muted-foreground">{leadsThisMonth} new this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{unassignedCount}</div>
                        <p className="text-xs text-muted-foreground">Require attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{conversionRate}%</div>
                        <p className="text-xs text-muted-foreground">{wonLeads} closed won</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resubmissions</CardTitle>
                        <RefreshCw className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{resubmittedCount}</div>
                        <p className="text-xs text-muted-foreground">Returning applicants</p>
                    </CardContent>
                </Card>
            </div>

            <DashboardCharts data={chartData} />
        </div>
    );
}
