"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StepEmployment() {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="employerName">Employer Name</Label>
                    <Input id="employerName" {...register("employerName")} />
                    {errors.employerName && <p className="text-sm text-red-500">{errors.employerName.message as string}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="position">Position / Title</Label>
                    <Input id="position" {...register("position")} />
                    {errors.position && <p className="text-sm text-red-500">{errors.position.message as string}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="employmentStatus">Employment Status</Label>
                    <select
                        {...register("employmentStatus")}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="SELF_EMPLOYED">Self Employed</option>
                        <option value="UNEMPLOYED">Unemployed</option>
                        <option value="RETIRED">Retired</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="monthlySalary">Monthly Salary</Label>
                    <Input id="monthlySalary" type="number" prefix="$" {...register("monthlySalary")} />
                    {errors.monthlySalary && <p className="text-sm text-red-500">{errors.monthlySalary.message as string}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paystubFrequency">Pay Frequency</Label>
                    <select
                        {...register("paystubFrequency")}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="WEEKLY">Weekly</option>
                        <option value="BI_WEEKLY">Bi-Weekly</option>
                        <option value="SEMI_MONTHLY">Semi-Monthly</option>
                        <option value="MONTHLY">Monthly</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="yearsEmployed">Years Employed</Label>
                    <Input id="yearsEmployed" type="number" step="0.1" {...register("yearsEmployed")} />
                    {errors.yearsEmployed && <p className="text-sm text-red-500">{errors.yearsEmployed.message as string}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="employerPhone">Employer Phone</Label>
                    <Input
                        id="employerPhone"
                        {...register("employerPhone")}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                            e.target.value = val;
                        }}
                    />
                    {errors.employerPhone && <p className="text-sm text-red-500">{errors.employerPhone.message as string}</p>}
                </div>
            </div>

            <div className="space-y-4 pt-2">
                <h3 className="text-sm font-medium">Employer Address</h3>
                <div className="space-y-2">
                    <Label htmlFor="empStreet">Street</Label>
                    <Input id="empStreet" {...register("employerAddress.street")} />
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(errors.employerAddress as any)?.street && <p className="text-sm text-red-500">{(errors.employerAddress as any).street.message as string}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="empCity">City</Label>
                        <Input id="empCity" {...register("employerAddress.city")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="empProv">Province/State</Label>
                        <Input id="empProv" {...register("employerAddress.provinceState")} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="empPostal">Postal/Zip</Label>
                        <Input id="empPostal" {...register("employerAddress.postalZip")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="empCountry">Country</Label>
                        <Input id="empCountry" defaultValue="Canada" {...register("employerAddress.country")} />
                    </div>
                </div>
            </div>
        </div>
    );
}
