"use client";

import { useEffect, useState } from "react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

interface ReportData {
    companyStats: {
        total: number;
        funded: number;
        approved: number;
        declined: number;
        qualified: number;
        unqualified: number;
        connected: number;
        unassigned: number;
    };
    officerStats: {
        id: string;
        name: string;
        role: string;
        totalAssigned: number;
        funded: number;
        approved: number;
        declined: number;
        unqualified: number;
        contacted: number;
        successRate: string;
    }[];
    financials?: {
        totalFundedVolume: number;
        totalRevenue: number;
    };
    fundedLeads?: {
        id: string;
        clientName: string;
        fundedAmount: number;
        fees: number;
        totalLoan: number;
        officerName: string;
        date?: string;
    }[];
}

export default function ReportsPage() {
    const [data, setData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [generatingPdf, setGeneratingPdf] = useState(false);

    // Default to current month
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    });

    useEffect(() => {
        setLoading(true);
        let query = "";
        if (dateRange?.from) {
            query += `?startDate=${dateRange.from.toISOString()}`;
            if (dateRange.to) {
                query += `&endDate=${dateRange.to.toISOString()}`;
            }
        }

        fetch(`/api/reports${query}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    setData(data);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [dateRange]);

    const handleDownloadPdf = async () => {
        setGeneratingPdf(true);
        try {
            const element = document.getElementById('report-content');

            let dateStr = "all-time";
            if (dateRange?.from) {
                dateStr = `${format(dateRange.from, 'yyyy-MM-dd')}`;
                if (dateRange.to) dateStr += `-to-${format(dateRange.to, 'yyyy-MM-dd')}`;
            }

            const opt = {
                margin: 0.5,
                filename: `leadforge-report-${dateStr}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            // Dynamic import to avoid SSR issues
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const html2pdf = (await import('html2pdf.js')).default as any;
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("PDF Export failed:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setGeneratingPdf(false);
        }
    };

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    if (!data) return <div className="p-8 text-center text-red-500">Failed to load reports.</div>;

    const { companyStats, officerStats, financials, fundedLeads } = data;

    // Calculate conversion rate
    const conversionRate = companyStats.total > 0
        ? ((companyStats.funded / companyStats.total) * 100).toFixed(1)
        : "0.0";

    return (
        <div id="report-content" className="space-y-8 p-6 max-w-7xl mx-auto bg-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Executive Report</h1>
                    <p className="text-muted-foreground mt-1">Performance metrics and financial overview.</p>
                    <div className="text-sm text-gray-500 mt-2">
                        <p>Generated: {format(new Date(), "PPpp")}</p>
                        <p>Range: {dateRange?.from ? format(dateRange.from, 'PP') : ''} - {dateRange?.to ? format(dateRange.to, 'PP') : ''}</p>
                        <p>Source: LeadForge System</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-end gap-3 w-full md:w-auto" data-html2canvas-ignore="true">
                    <div className="w-full md:w-auto">
                        <DatePickerWithRange
                            date={dateRange}
                            setDate={setDateRange}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={handleDownloadPdf} variant="outline" className="gap-2" disabled={generatingPdf}>
                            {generatingPdf ? <Loader2 className="animate-spin h-4 w-4" /> : <Printer size={16} />}
                            {generatingPdf ? "Generating..." : "Download PDF"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Business Insights (Financials) */}
            {financials && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
                    <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-blue-700 uppercase tracking-wider">Total Funded Volume</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-slate-900">
                                ${financials.totalFundedVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <p className="text-sm text-blue-600/80 mt-1 font-medium">Principal Disbursed</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-white border-green-100 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-green-700 uppercase tracking-wider">Net Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-slate-900">
                                ${financials.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <p className="text-sm text-green-600/80 mt-1 font-medium">Total Fees Generated</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 break-inside-avoid">
                <Card className="shadow-sm">
                    <CardHeader className="p-4 pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase">Total Leads</CardTitle></CardHeader>
                    <CardContent className="p-4 pt-0"><div className="text-2xl font-bold text-slate-900">{companyStats.total}</div></CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="p-4 pb-2"><CardTitle className="text-xs font-medium text-green-600 uppercase">Funded Loans</CardTitle></CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-slate-900">{companyStats.funded}</div>
                        <p className="text-xs text-muted-foreground mt-1">{conversionRate}% Conversion</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="p-4 pb-2"><CardTitle className="text-xs font-medium text-purple-600 uppercase">Approved</CardTitle></CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-slate-900">{companyStats.approved}</div>
                        <p className="text-xs text-muted-foreground mt-1">Ready to Fund</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="p-4 pb-2"><CardTitle className="text-xs font-medium text-blue-600 uppercase">Active</CardTitle></CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold text-slate-900">
                            {companyStats.total - (companyStats.funded + companyStats.approved + companyStats.declined + companyStats.unqualified)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">In Pipeline</p>
                    </CardContent>
                </Card>
            </div>

            {/* Funded Loan Detail Table */}
            {fundedLeads && fundedLeads.length > 0 && (
                <div className="space-y-4 break-inside-avoid">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Funded Portfolio</h2>
                    </div>

                    <div className="rounded-lg border shadow-sm bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50 print:bg-gray-50">
                                    <TableHead className="font-semibold text-slate-900">Client</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Officer</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-900">Funded Amount</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-900">Revenue</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-900">Total Loan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fundedLeads.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell className="font-medium text-slate-700">{lead.clientName}</TableCell>
                                        <TableCell className="text-slate-600">{lead.officerName}</TableCell>
                                        <TableCell className="text-right text-slate-600 font-mono">${lead.fundedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell className="text-right text-green-700 font-medium font-mono">${lead.fees.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell className="text-right font-bold text-slate-900 font-mono">${lead.totalLoan.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {/* Officer Performance Table */}
            <div className="space-y-4 break-inside-avoid">
                <h2 className="text-xl font-bold text-slate-900">Officer Performance</h2>
                <div className="rounded-lg border shadow-sm bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 print:bg-gray-50">
                                <TableHead className="font-semibold text-slate-900">Officer Name</TableHead>
                                <TableHead className="text-right font-semibold text-slate-900">Assigned</TableHead>
                                <TableHead className="text-right font-semibold text-slate-900 text-purple-600">Approved</TableHead>
                                <TableHead className="text-right font-semibold text-slate-900 text-green-600">Funded</TableHead>
                                <TableHead className="text-right font-semibold text-slate-900 text-red-500">Declined</TableHead>
                                <TableHead className="text-right font-semibold text-slate-900 text-orange-500">Unqualified</TableHead>
                                <TableHead className="text-right font-semibold text-slate-900">Conversion</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {officerStats.map((officer) => (
                                <TableRow key={officer.id}>
                                    <TableCell className="font-medium text-slate-700">{officer.name}</TableCell>
                                    <TableCell className="text-right text-slate-600">{officer.totalAssigned}</TableCell>
                                    <TableCell className="text-right font-bold text-purple-700">{officer.approved}</TableCell>
                                    <TableCell className="text-right font-bold text-green-700">{officer.funded}</TableCell>
                                    <TableCell className="text-right text-red-600">{officer.declined}</TableCell>
                                    <TableCell className="text-right text-orange-600">{officer.unqualified}</TableCell>
                                    <TableCell className="text-right text-slate-600">{officer.successRate}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Distribution Visuals */}
            <div className="space-y-4 break-inside-avoid">
                <h2 className="text-xl font-bold text-slate-900">Pipeline Distribution</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(companyStats).map(([key, value]) => {
                        if (key === 'total') return null;
                        const label = key.replace(/([A-Z])/g, ' $1').trim();
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const percent = companyStats.total > 0 ? ((value as number / companyStats.total) * 100).toFixed(1) : "0";

                        return (
                            <div key={key} className="p-4 border rounded-lg bg-white shadow-sm print:shadow-none print:border-gray-200">
                                <div className="text-xs uppercase text-muted-foreground font-bold mb-2 tracking-wide">{label}</div>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-2xl font-bold text-slate-900">{value as number}</span>
                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{percent}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
                                    <div className="bg-slate-800 h-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="text-center pt-8 text-xs text-muted-foreground block">
                <p>Confidential & Proprietary - {format(new Date(), "yyyy")}</p>
            </div>
        </div>
    );
}
