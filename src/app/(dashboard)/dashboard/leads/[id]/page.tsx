import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, User, Phone, Mail, MapPin, Briefcase, Car, Home as HomeIcon, Calendar } from "lucide-react";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadStatusSelector, LeadOwnerSelector, NotesSection } from "@/components/leads/lead-detail-client";
import { EditLeadDialog } from "@/components/leads/edit-lead-dialog";
import { FundingEditor } from "@/components/leads/funding-details";
import { serializeForClient } from "@/lib/utils";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return notFound(); // or redirect

    const results = await Promise.all([
        prisma.lead.findUnique({
            where: { id: params.id },
            include: {
                current_owner: {
                    select: { id: true, first_name: true, last_name: true }
                },
                notes: {
                    include: { user: { select: { first_name: true, last_name: true } } },
                    orderBy: { created_at: "desc" }
                },
                history: {
                    orderBy: { created_at: "desc" },
                    include: {
                        from_user: { select: { first_name: true, last_name: true } },
                        to_user: { select: { first_name: true, last_name: true } },
                        performed_by: { select: { first_name: true, last_name: true } }
                    }
                }
            }
        }),
        prisma.user.findMany({
            where: { company_id: session.user.company_id, is_active: true },
            select: { id: true, first_name: true, last_name: true }
        }),
        prisma.company.findUnique({
            where: { id: session.user.company_id },
            select: { default_admin_fee_percent: true }
        })
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const company = results[2];
    const rawLead = results[0];
    const users = results[1];

    if (!rawLead) return notFound();

    // Serialize lead data (convert Decimals to strings/numbers) for Client Components

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lead = serializeForClient(rawLead) as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userOptions = users.map((u: any) => ({ id: u.id, name: `${u.first_name} ${u.last_name}` }));

    interface VehicleDetails {
        year: string;
        make: string;
        model: string;
        odometer: string;
        hasLien: boolean;
        lienBalance?: string;
        lienBank?: string;
    }

    interface HomeDetails {
        isPaidOff: boolean;
        mortgageBalance?: string;
        loanCompany?: string;
    }

    const vehicleDetails = lead.vehicle_details as unknown as VehicleDetails;
    const homeDetails = lead.home_details as unknown as HomeDetails;

    // Decrypt SIN (careful with logging)
    let visibleSin = "XXX-XXX-XXX";
    try {
        if (lead.sin_full) visibleSin = decrypt(lead.sin_full);
    } catch (e) {
        console.error("Failed to decrypt SIN", e);
    }

    // Prepare object for Edit Form (replace encrypted SIN with visible one)
    const leadDataForEdit = {
        ...lead,
        sin_full: visibleSin !== "XXX-XXX-XXX" ? visibleSin : "" // Should be decrypted if possible
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/leads">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="flex-1 md:hidden">
                        {/* Mobile Title Simple */}
                        <h1 className="text-xl font-bold">{lead.first_name} {lead.last_name}</h1>
                    </div>
                </div>

                <div className="flex-1 hidden md:block">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        {lead.first_name} {lead.last_name}
                        {lead.is_resubmission && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded border border-orange-200">
                                Resubmission
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-4">
                        <span className="flex items-center gap-1"><Mail size={12} /> {lead.email}</span>
                        <span className="flex items-center gap-1"><Phone size={12} /> {lead.phone}</span>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                    <EditLeadDialog lead={leadDataForEdit} userId={session.user.id} />

                    <div className="flex flex-col items-start sm:items-end">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Current Owner</span>
                        <LeadOwnerSelector
                            leadId={lead.id}
                            currentOwnerId={lead.current_owner_id}
                            users={userOptions}
                        />
                    </div>
                    <div className="flex flex-col items-start sm:items-end">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Status</span>
                        <LeadStatusSelector leadId={lead.id} currentStatus={lead.status} />
                    </div>
                </div>
            </div>

            {/* Funding Details Section */}
            <FundingEditor
                lead={lead}
                defaultAdminFeePercent={company?.default_admin_fee_percent ? Number(company.default_admin_fee_percent.toString()) : 0}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Details */}
                <div className="md:col-span-2 space-y-6">

                    {/* Loan Info */}
                    <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Calendar size={16} /> Loan Request</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs">Loan Type</p>
                                <p className="font-medium">{lead.loan_type?.replace("_", " ")}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Amount Requested</p>
                                <p className="font-medium text-lg text-primary">
                                    {lead.amount_requested
                                        ? `$${Number(lead.amount_requested).toLocaleString()}`
                                        : "N/A"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal & Address */}
                    <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><User size={16} /> Personal & Address</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs">Full Name</p>
                                <p className="font-medium">{lead.first_name} {lead.last_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">SIN</p>
                                <p className="font-medium font-mono">{visibleSin}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Address</p>
                                <p>{lead.street}, {lead.city}</p>
                                <p>{lead.province_state}, {lead.postal_zip}, {lead.country}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Geolocation</p>
                                {lead.latitude ? (
                                    <p className="flex items-center gap-1">
                                        <MapPin size={12} className="text-blue-500" />
                                        {lead.latitude.toFixed(4)}, {lead.longitude?.toFixed(4)}
                                        <span className="text-xs text-gray-400 ml-1">
                                            (±{lead.location_accuracy?.toFixed(0) || "&nbsp;"}m)
                                        </span>
                                    </p>
                                ) : (
                                    <p className="text-gray-400 italic">Not captured</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Employment */}
                    <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Briefcase size={16} /> Employment</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs">Employer</p>
                                <p className="font-medium">{lead.employer_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Position</p>
                                <p>{lead.position}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Status</p>
                                <p>{lead.employment_status?.replace("_", " ")}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Tenure</p>
                                <p>{lead.years_employed.toString()} Years</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Monthly Income</p>
                                <p className="font-medium">${Number(lead.monthly_salary).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Pay Frequency</p>
                                <p>{lead.paystub_frequency?.replace("_", " ")}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Employer Phone</p>
                                <p>{lead.employer_phone}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Assets (Side by Side) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Car size={16} /> Vehicle</CardTitle></CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Owns Vehicle?</span>
                                    <span className="font-medium">{lead.owns_vehicle ? "Yes" : "No"}</span>
                                </div>
                                {lead.owns_vehicle && lead.vehicle_details && (
                                    <>
                                        <div className="p-2 bg-gray-50 rounded text-xs space-y-1">
                                            <p className="font-semibold">{vehicleDetails.year} {vehicleDetails.make} {vehicleDetails.model}</p>
                                            <p>{vehicleDetails.odometer} km</p>
                                            {vehicleDetails.hasLien && (
                                                <div className="text-red-600 mt-1">
                                                    Lien: ${vehicleDetails.lienBalance} ({vehicleDetails.lienBank})
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle className="text-base flex items-center gap-2"><HomeIcon size={16} /> Home</CardTitle></CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Owns Home?</span>
                                    <span className="font-medium">{lead.owns_home ? "Yes" : "No"}</span>
                                </div>
                                {lead.owns_home && lead.home_details && (
                                    <>
                                        <div className="p-2 bg-gray-50 rounded text-xs space-y-1">
                                            <div className="flex justify-between">
                                                <span>Paid Off?</span>
                                                <span className={homeDetails.isPaidOff ? "text-green-600 font-bold" : "text-gray-700"}>{homeDetails.isPaidOff ? "Yes" : "No"}</span>
                                            </div>
                                            {!homeDetails.isPaidOff && (
                                                <div className="mt-1">
                                                    Mortgage: ${homeDetails.mortgageBalance}
                                                    <div className="text-gray-500">{homeDetails.loanCompany}</div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* History */}
                    <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Calendar size={16} /> History</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-[200px] overflow-y-auto">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {lead.history.map((hist: any) => (
                                    <div key={hist.id} className="text-xs flex gap-2 items-center">
                                        <span className="text-gray-400 w-24">{format(new Date(hist.created_at), "MMM d, yyyy")}</span>
                                        <span>
                                            Transferred from <strong>{hist.from_user?.first_name || "System"}</strong> to <strong>{hist.to_user?.first_name || "Unassigned"}</strong>
                                            <span className="text-gray-400 mx-1">by {hist.performed_by?.first_name}</span>
                                        </span>
                                    </div>
                                ))}
                                {lead.history.length === 0 && <p className="text-xs text-gray-500">No ownership changes recorded.</p>}
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column: Actions & Notes */}
                <div className="space-y-6">
                    <Card className="h-full">
                        <CardContent className="pt-6">
                            <NotesSection leadId={lead.id} notes={lead.notes} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
