"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Make sure this matches Prisma Enum or is compatible string
type PaystubFrequency = "WEEKLY" | "BI_WEEKLY" | "SEMI_MONTHLY" | "MONTHLY";

interface FundingEditorProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lead: any;
    defaultAdminFeePercent?: number;
}

export function FundingEditor({ lead, defaultAdminFeePercent = 0 }: FundingEditorProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Initial values
    const [fundedAmount, setFundedAmount] = useState<string>(lead.funded_amount?.toString() || "");
    const [adminFeeRate, setAdminFeeRate] = useState<string>(
        // Use saved rate if exists (derived?), otherwise default from company
        // If we don't store rate on lead, we might infer it or just start with default
        // Let's assume for new edits we prefer the default if not manually overridden/set?
        // Actually user says "admin fees will be set by company admin... calculated automatically".
        // So we should defaulted to company rate.
        defaultAdminFeePercent.toString()
    );
    const [adminFeeAmount, setAdminFeeAmount] = useState<string>(lead.admin_fee?.toString() || "");

    const [ppsrFee, setPpsrFee] = useState<string>(lead.ppsr_fee?.toString() || "");
    const [dischargeAmount, setDischargeAmount] = useState<string>(lead.discharge_amount?.toString() || "");

    const [frequency, setFrequency] = useState<PaystubFrequency | "">(lead.loan_payment_frequency || "");
    const [firstPaymentDate, setFirstPaymentDate] = useState<Date | undefined>(
        lead.first_payment_date ? new Date(lead.first_payment_date) : undefined
    );

    // Calculated Total
    // Total = Funded + Admin Fee + PPSR
    // Discharge is separate (likely deducted from proceeds sent to client, but loan amount includes it? User said "discharge won't count in total" - assuming Total Loan Size).

    const calculateTotal = () => {
        const funded = parseFloat(fundedAmount) || 0;
        const admin = parseFloat(adminFeeAmount) || 0;
        const ppsr = parseFloat(ppsrFee) || 0;
        return (funded + admin + ppsr).toFixed(2);
    };

    // Auto-calc admin fee amount when Funded Amount changes
    useEffect(() => {
        if (fundedAmount && adminFeeRate) {
            const funded = parseFloat(fundedAmount);
            const rate = parseFloat(adminFeeRate);
            if (!isNaN(funded) && !isNaN(rate)) {
                const fee = (funded * (rate / 100)).toFixed(2);
                setAdminFeeAmount(fee);
            }
        }
    }, [fundedAmount, adminFeeRate]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const total = calculateTotal();

            const res = await fetch(`/api/leads/${lead.id}/funding`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    funded_amount: fundedAmount,
                    admin_fee: adminFeeAmount,
                    ppsr_fee: ppsrFee,
                    discharge_amount: dischargeAmount,
                    total_loan_amount: total,
                    loan_payment_frequency: frequency,
                    first_payment_date: firstPaymentDate
                })
            });

            if (!res.ok) throw new Error("Failed to save");

            router.refresh();
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            alert("Failed to save funding details");
        } finally {
            setSaving(false);
        }
    };

    const total = calculateTotal();

    // Re-sync on lead update
    useEffect(() => {
        if (!isEditing) {
            setFundedAmount(lead.funded_amount?.toString() || "");
            setAdminFeeAmount(lead.admin_fee?.toString() || "");
            setPpsrFee(lead.ppsr_fee?.toString() || "");
            setDischargeAmount(lead.discharge_amount?.toString() || "");
            setFrequency(lead.loan_payment_frequency || "");
            setFirstPaymentDate(lead.first_payment_date ? new Date(lead.first_payment_date) : undefined);
        }
    }, [lead, isEditing]);

    const { data: session } = useSession();
    // 'AGENT' role cannot edit fees. 
    // Rate is effectively determined by Company Default now, so maybe read-only for everyone in this context?
    // User said "cannot access by loan officer", implying admin might change it?
    // Let's keep strict restriction for Agent.
    const canEditFees = session?.user?.role !== "AGENT";

    if (!isEditing) {
        // View Mode
        return (
            <Card className="print:shadow-none print:border-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2 print:px-0">
                    <CardTitle className="text-xl font-bold">Funding Details</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="print:hidden">
                        Edit
                    </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-2 print:px-0">
                    {/* ... (existing view content) ... */}
                    <div>
                        <Label className="text-muted-foreground">Funded Amount</Label>
                        <p className="text-lg font-semibold">${lead.funded_amount ? parseFloat(lead.funded_amount).toFixed(2) : "0.00"}</p>
                    </div>
                    <div>
                        <Label className="text-muted-foreground">Admin Fee</Label>
                        <p className="text-lg font-semibold">${lead.admin_fee ? parseFloat(lead.admin_fee).toFixed(2) : "0.00"}</p>
                    </div>
                    <div>
                        <Label className="text-muted-foreground">PPSR Fee</Label>
                        <p className="text-lg font-semibold">${lead.ppsr_fee ? parseFloat(lead.ppsr_fee).toFixed(2) : "0.00"}</p>
                    </div>
                    <div>
                        <Label className="text-muted-foreground text-blue-600">Total Loan Amount</Label>
                        <p className="text-lg font-bold text-blue-700">${lead.total_loan_amount ? parseFloat(lead.total_loan_amount).toFixed(2) : "0.00"}</p>
                    </div>
                    <div className="pt-2">
                        <Label className="text-muted-foreground">Discharge Amount</Label>
                        <p className="text-lg font-medium">${lead.discharge_amount ? parseFloat(lead.discharge_amount).toFixed(2) : "0.00"}</p>
                    </div>
                    <div className="pt-2">
                        <Label className="text-muted-foreground">Payment Frequency</Label>
                        <p className="text-lg font-medium capitalize">{lead.loan_payment_frequency ? lead.loan_payment_frequency.toLowerCase().replace('_', ' ') : "-"}</p>
                    </div>
                    <div className="pt-2">
                        <Label className="text-muted-foreground">First Payment Date</Label>
                        <p className="text-lg font-medium">{lead.first_payment_date ? format(new Date(lead.first_payment_date), "MMM d, yyyy") : "-"}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Edit Mode
    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Funding Details</CardTitle>
                <CardDescription>Calculate final loan amounts and fees.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Funded Amount ($)</Label>
                        <Input type="number" value={fundedAmount} onChange={e => setFundedAmount(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Admin Fee Rate (%)</Label>
                        <Input
                            type="number"
                            placeholder="Optional %"
                            value={adminFeeRate}
                            onChange={e => setAdminFeeRate(e.target.value)}
                            disabled={!canEditFees}
                        // User requested automatic calc based on company settings
                        // We default it to that setting. Admins can override? "admin fees will be set by company admin" -> implies configuration
                        // "update all fields and data"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Admin Fee Amount ($)</Label>
                        <Input
                            type="number"
                            value={adminFeeAmount}
                            onChange={e => setAdminFeeAmount(e.target.value)}
                            disabled={true} // Always auto-calculated now based on request? Or generally read-only for agent
                        // "calculated automatically" implies it should be read-only derived from (Funded * Rate)
                        // But usually we allow manual override?
                        // "cannot access by loan officer" -> strict
                        // Let's enable for Admin, disable for Agent, but emphasize auto-calc
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>PPSR Fee ($)</Label>
                        <Input
                            type="number"
                            value={ppsrFee}
                            onChange={e => setPpsrFee(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Discharge Amount ($)</Label>
                        <Input type="number" value={dischargeAmount} onChange={e => setDischargeAmount(e.target.value)} />
                        <p className="text-xs text-muted-foreground">Not included in Total Loan Amount calculation</p>
                    </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-md flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-blue-900">Total Calculated Loan Amount</p>
                        <p className="text-xs text-blue-700">Funded + Admin Fee + PPSR</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                        ${total}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Payment Frequency</Label>
                        <Select value={frequency} onValueChange={(val) => setFrequency(val as PaystubFrequency)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                                <SelectItem value="BI_WEEKLY">Bi-Weekly</SelectItem>
                                <SelectItem value="SEMI_MONTHLY">Semi-Monthly</SelectItem>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <Label className="mb-2">First Payment Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !firstPaymentDate && "text-muted-foreground"
                                    )}
                                >
                                    {firstPaymentDate ? (
                                        format(firstPaymentDate, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={firstPaymentDate}
                                    onSelect={setFirstPaymentDate}
                                    disabled={(date: Date) =>
                                        date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Save Details
                </Button>
            </CardFooter>
        </Card>
    );
}
