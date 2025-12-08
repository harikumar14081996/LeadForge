"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Note: Using `useFormContext` assumes parent is wrapping with FormProvider.
// But Step 0 is separate. Step 1-5 will be inside FormProvider.

interface StepPersonalProps {
    isInternal?: boolean;
}

export function StepPersonal({ isInternal }: StepPersonalProps) {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...register("firstName")} />
                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message as string}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...register("lastName")} />
                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message as string}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Email</Label>
                {/* Read only from step 0 unless internal */}
                <Input {...register("email")} disabled={!isInternal} className={!isInternal ? "bg-gray-100" : ""} />
            </div>

            <div className="space-y-2">
                <Label>Phone</Label>
                {/* Read only from step 0 unless internal */}
                {/* Even if internal, we might want to restrict editing format if we allow changes. 
                    Given the structure, if it's internal we allow editing. */}
                <Input
                    {...register("phone")}
                    disabled={!isInternal}
                    className={!isInternal ? "bg-gray-100" : ""}
                    onChange={(e) => {
                        if (isInternal) {
                            // Only apply restriction if editable
                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                            register("phone").onChange({ target: { value: val, name: "phone" } });
                            // Direct DOM manipulation for instant feedback if needed or rely on React Rerender if state bound,
                            // but react-hook-form handles uncontrolled inputs mostly.
                            // Best way with RHF uncontrolled:
                            e.target.value = val;
                        }
                    }}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="sin">Social Insurance Number (SIN)</Label>
                <Input
                    id="sin"
                    placeholder="XXXXXXXXX"
                    {...register("sin")}
                    onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 9);
                        e.target.value = val;
                    }}
                />
                <p className="text-xs text-muted-foreground">9 digits, numbers only</p>
                {errors.sin && <p className="text-sm text-red-500">{errors.sin.message as string}</p>}
            </div>



            <div className="flex items-start space-x-2 pt-4">
                <input type="checkbox" id="consent" {...register("consentGiven")} className="mt-1" />
                <Label htmlFor="consent" className="text-sm font-normal">
                    I consent to share my personal information and agree to the <a href="/privacy-policy" className="text-primary hover:underline" target="_blank">Privacy Policy</a>. This is to do a credit check.
                </Label>
            </div>
            {errors.consentGiven && <p className="text-sm text-red-500">{errors.consentGiven.message as string}</p>}
        </div>
    );
}
