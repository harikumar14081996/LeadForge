"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { leadFormSchema, type LeadFormValues } from "@/lib/schemas";

import { StepCheck } from "./steps/StepCheck";
import { StepPersonal } from "./steps/StepPersonal";
import { StepAddress } from "./steps/StepAddress";
import { StepEmployment } from "./steps/StepEmployment";
import { StepVehicle } from "./steps/StepVehicle";
import { StepHome } from "./steps/StepHome";


interface ApplicationWizardProps {
    isInternal?: boolean;
    userId?: string;
    onSuccess?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any; // New prop for editing
}

export function ApplicationWizard({ isInternal = false, userId, onSuccess, companyId, initialData }: ApplicationWizardProps) {
    const [step, setStep] = useState(isInternal ? 1 : 0); // Skip check if internal
    const [leadId, setLeadId] = useState<string | null>(initialData?.id || null);
    const [isUpdate, setIsUpdate] = useState(!!initialData);
    const [lastAppDate, setLastAppDate] = useState<Date | null>(initialData ? new Date(initialData.created_at) : null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helper to map Prisma data to Form Values
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapLeadToForm = (lead: any): any => ({
        email: lead.email,
        phone: lead.phone,
        firstName: lead.first_name,
        lastName: lead.last_name,
        sin: lead.sin_full, // Ensure this is decrypted/visible if passed
        consentGiven: true,
        connectedOwner: lead.connected_owner ? "Yes" : "No",

        street: lead.street,
        city: lead.city,
        provinceState: lead.province_state,
        country: lead.country,
        postalZip: lead.postal_zip,

        employerName: lead.employer_name,
        position: lead.position,
        yearsEmployed: parseFloat(lead.years_employed),
        employerPhone: lead.employer_phone,
        employerAddress: lead.employer_address,
        employmentStatus: lead.employment_status,
        monthlySalary: parseFloat(lead.monthly_salary),
        paystubFrequency: lead.paystub_frequency,

        ownsVehicle: lead.owns_vehicle,
        vehicleDetails: lead.vehicle_details || undefined,

        ownsHome: lead.owns_home,
        homeDetails: lead.home_details || undefined,

        loanType: lead.loan_type,
        amountRequested: parseFloat(lead.amount_requested),
    });

    // Main Form
    const methods = useForm<LeadFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(leadFormSchema) as any,
        mode: "onBlur",
        defaultValues: initialData ? mapLeadToForm(initialData) : (isInternal ? {
            consentGiven: true,
            loanType: "PERSONAL_LOAN"
        } : undefined)
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { reset, trigger, handleSubmit, formState: { errors } } = methods;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCheckComplete = (data: { email: string; phone: string; existingLead?: any }) => {
        if (data.existingLead) {
            const lead = data.existingLead;
            setIsUpdate(true);
            setLeadId(lead.id);
            setLastAppDate(new Date(lead.created_at));

            reset(mapLeadToForm(lead));
        } else {
            // New user, pre-fill email/phone
            reset({
                email: data.email,
                phone: data.phone,
                consentGiven: false,
                // defaults
                ownsVehicle: false,
                ownsHome: false,
                loanType: "PERSONAL_LOAN",
            });
        }
        setStep(1);
    };

    const nextStep = async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let fieldsToValidate: any[] = [];
        switch (step) {
            case 1: fieldsToValidate = ["firstName", "lastName", "sin", "consentGiven", "connectedOwner"]; break;
            case 2: fieldsToValidate = ["street", "city", "provinceState", "country", "postalZip"]; break;
            case 3: fieldsToValidate = ["employerName", "position", "yearsEmployed", "employerPhone", "employerAddress"]; break;
            case 4: fieldsToValidate = ["ownsVehicle", "vehicleDetails"]; break;
            case 5: fieldsToValidate = ["ownsHome", "homeDetails", "loanType", "amountRequested"]; break;
        }

        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            if (step < 5) {
                setStep(step + 1);
            } else {
                // Submit
                await wrapSubmit();
            }
        }
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const wrapSubmit = handleSubmit(async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                isUpdate,
                leadId,
                isInternal,
                ownerId: userId,
                companyId // Pass it along
            };

            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setStep(6);
            } else {
                alert("Submission failed. Please try again.");
            }
        } catch (e) {
            console.error(e);
            alert("Error submitting form");
        } finally {
            setIsSubmitting(false);
        }
    });

    if (step === 0) {
        return (
            <Card className="max-w-md mx-auto">
                <CardContent className="pt-6">
                    <StepCheck onComplete={handleCheckComplete} />
                </CardContent>
            </Card>
        );
    }

    if (step === 6) {
        return (
            <Card className={cn("max-w-md mx-auto text-center", isInternal && "border-0 shadow-none max-w-full")}>
                <CardContent className="pt-10 space-y-4">
                    <div className="flex justify-center">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{isInternal ? "Lead Created Successfully!" : "Application Received!"}</CardTitle>
                    <p className="text-gray-500">
                        {isInternal
                            ? "The lead has been created and assigned to you. You can view it in your dashboard."
                            : "Thank you for submitting your application. A loan specialist will review your details and contact you shortly."}
                    </p>
                    <Button onClick={() => {
                        if (onSuccess) {
                            onSuccess();
                        } else {
                            window.location.href = isInternal ? "/dashboard/my-leads" : "/";
                        }
                    }} className="mt-6">
                        {isInternal ? "Close & View Leads" : "Return Home"}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <FormProvider {...methods}>
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Banner for Returning User (Public Only) */}
                {isUpdate && !isInternal && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md flex items-start">
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-blue-800">Welcome Back!</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                We found your previous application from {lastAppDate ? format(lastAppDate, "MMM d, yyyy") : ""}.
                                Your information has been pre-filled. Please review and update where necessary.
                            </p>
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 uppercase tracking-wide font-semibold">
                    <span>Step {step} of 5</span>
                    <span>
                        {step === 1 && "Personal Info"}
                        {step === 2 && "Address"}
                        {step === 3 && "Employment"}
                        {step === 4 && "Vehicle"}
                        {step === 5 && "Complete"}
                    </span>
                </div>

                <Card className={cn(isInternal && "border-0 shadow-none")}>
                    <CardHeader className={cn(isInternal && "px-0")}>
                        <CardTitle>
                            {step === 1 && "Personal Information"}
                            {step === 2 && "Address Details"}
                            {step === 3 && "Employment Details"}
                            {step === 4 && "Vehicle Assets"}
                            {step === 5 && "Property & Loan"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={cn("min-h-[400px]", isInternal && "px-0")}>
                        {step === 1 && <StepPersonal isInternal={isInternal} />}
                        {step === 2 && <StepAddress />}
                        {step === 3 && <StepEmployment />}
                        {step === 4 && <StepVehicle />}
                        {step === 5 && <StepHome />}
                    </CardContent>
                    <CardFooter className={cn("flex justify-between border-t p-6 bg-gray-50 rounded-b-xl", isInternal && "px-0 bg-transparent border-t-0")}>
                        <Button variant="outline" onClick={prevStep} disabled={step === 1 || (isInternal && step === 1)}>
                            Back
                        </Button>

                        {step === 5 ? (
                            <div className="flex flex-col items-end gap-2 w-full ml-4">
                                {isUpdate && (
                                    <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200 text-right w-full mb-2">
                                        ⚠ Submitting will update your previous application.
                                    </div>
                                )}
                                <Button onClick={nextStep} disabled={isSubmitting} className="w-32">
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isUpdate ? "Update Application" : "Submit Application"}
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={nextStep}>
                                Next Step
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </FormProvider>
    );
}
