"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"; // Needs create or standard

// Simple Badge component inline if not exist, but let's assume I create it later or simple span.
// I'll create `ui/badge` and `ui/table` later or use standard divs if I want to skip.
// I'll assume standard shadcn-like structure.

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        UNASSIGNED: "bg-gray-100 text-gray-800",
        ATTEMPTED_TO_CONTACT: "bg-yellow-100 text-yellow-800",
        CONNECTED: "bg-blue-100 text-blue-800",
        QUALIFIED: "bg-purple-100 text-purple-800",
        UNQUALIFIED: "bg-red-100 text-red-800",
        DECLINED: "bg-red-200 text-red-900", // Darker red for declined
        FUNDED: "bg-green-100 text-green-800",
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100"}`}>
            {status.replace("_", " ")}
        </span>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LeadsTable({ leads }: { leads: any[] }) {
    if (leads.length === 0) {
        return <div className="p-8 text-center text-gray-500 bg-white rounded-lg border">No leads found matching your criteria.</div>;
    }

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Loan Type</TableHead>
                        <TableHead>Applied On</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {leads.map((lead: any) => (
                        <TableRow key={lead.id}>
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span>{lead.first_name} {lead.last_name}</span>
                                    <span className="text-xs text-gray-500">{lead.email}</span>
                                </div>
                                {lead.is_resubmission && (
                                    <span className="inline-block mt-1 text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200">
                                        Resubmission
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={lead.status} />
                            </TableCell>
                            <TableCell>{lead.loan_type?.replace(/_/g, " ")}</TableCell>
                            <TableCell>
                                {format(new Date(lead.created_at), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                                {lead.current_owner ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                            {lead.current_owner.first_name[0]}{lead.current_owner.last_name[0]}
                                        </div>
                                        <span className="text-sm text-gray-600 truncate max-w-[100px]">
                                            {lead.current_owner.first_name}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-gray-400 italic text-sm">Unassigned</span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/dashboard/leads/${lead.id}`}>
                                        View
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
