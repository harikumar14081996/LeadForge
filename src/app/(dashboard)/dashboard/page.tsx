import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfMonth, subDays, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { Users, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import { LeadStatus } from "@prisma/client";
import { CompanyShareCard } from "@/components/dashboard/company-share-card";

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
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Hero */}
            <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium border border-blue-500/30">
                        <CheckCircle className="h-3 w-3 mr-2" />
                        System Operational
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                        Welcome back, <span className="text-blue-400">{session.user.name}</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl">
                        This is your <strong>Unified Command Center</strong>. From this single dashboard, you can track every lead, monitor team performance, and manage your entire lending pipeline.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Leads</CardTitle>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{totalLeads}</div>
                        <p className="text-xs text-slate-500 mt-1">{leadsThisMonth} new this month</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Unassigned</CardTitle>
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{unassignedCount}</div>
                        <p className="text-xs text-slate-500 mt-1">Require immediate attention</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Conversion Rate</CardTitle>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{conversionRate}%</div>
                        <p className="text-xs text-slate-500 mt-1">{wonLeads} closed won</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Resubmissions</CardTitle>
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <RefreshCw className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{resubmittedCount}</div>
                        <p className="text-xs text-slate-500 mt-1">Returning applicants</p>
                    </CardContent>
                </Card>

                {/* Company Share Link Card - Spans full width on mobile, fits in grid on desktop */}
                <div className="md:col-span-2 lg:col-span-1">
                    <CompanyShareCard companyId={companyId} />
                </div>
            </div>

            <DashboardCharts data={chartData} />
        </div>
    );
}
