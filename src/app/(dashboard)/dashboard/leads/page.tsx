import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { LeadsFilters } from "@/components/leads/leads-filters";
import { LeadsTable } from "@/components/leads/leads-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LeadStatus, LoanType } from "@prisma/client";
import { AddLeadDialog } from "@/components/leads/add-lead-dialog";

export default async function LeadsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const companyId = session.user.company_id;

    // Params
    const page = parseInt(searchParams.page as string) || 1;
    const search = searchParams.search as string;
    const status = searchParams.status as string;
    const loanType = searchParams.loanType as string;
    const provinces = (searchParams.provinces as string)?.split(",").filter(Boolean) || [];
    const employment = searchParams.employment as string;
    const vehicle = searchParams.vehicle === "true";
    const home = searchParams.home === "true";

    const from = searchParams.from as string;
    const to = searchParams.to as string;

    const pageSize = 20;

    // Build Filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
        company_id: companyId,
    };

    if (search) {
        where.OR = [
            { first_name: { contains: search, mode: "insensitive" } },
            { last_name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
        ];
    }

    if (status && status !== "ALL") {
        where.status = status as LeadStatus;
    }

    if (loanType && loanType !== "ALL") {
        where.loan_type = loanType as LoanType;
    }

    if (provinces.length > 0) {
        where.province_state = { in: provinces };
    }

    if (employment && employment !== "ALL") {
        where.employment_status = employment as any; // Cast if enum import needed
    }

    if (vehicle) {
        where.owns_vehicle = true;
    }

    if (home) {
        where.owns_home = true;
    }

    if (from || to) {
        where.created_at = {};
        if (from) where.created_at.gte = new Date(from);
        if (to) where.created_at.lte = new Date(to);
    }

    const leads = await prisma.lead.findMany({
        where,
        include: {
            current_owner: {
                select: { id: true, first_name: true, last_name: true }
            }
        },
        orderBy: { created_at: "desc" },
        take: pageSize,
        skip: (page - 1) * pageSize,
    });

    const totalCount = await prisma.lead.count({ where });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
                    <p className="text-muted-foreground">Manage and track your applications.</p>
                </div>
                <AddLeadDialog userId={session.user.id} />
            </div>

            <LeadsFilters />

            <LeadsTable leads={leads as any[]} />

            {/* Basic Pagination info */}
            <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                    Showing {leads.length} of {totalCount} leads
                </div>
                <div className="flex gap-2">
                    {page > 1 && (
                        <Link href={`/dashboard/leads?page=${page - 1}`} className="hover:underline">Previous</Link>
                    )}
                    {leads.length === pageSize && (
                        <Link href={`/dashboard/leads?page=${page + 1}`} className="hover:underline">Next</Link>
                    )}
                </div>
            </div>
        </div>
    );
}
