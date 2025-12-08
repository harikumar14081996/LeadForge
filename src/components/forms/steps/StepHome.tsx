"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StepHome() {
    const { register, watch, setValue, formState: { errors } } = useFormContext();
    const ownsHome = watch("ownsHome");
    const isPaidOff = watch("homeDetails.isPaidOff");
    // const loanType = watch("loanType"); // We use RadioGroup usually controlled

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Do you own a home?</Label>
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50 w-full">
                            <input
                                type="radio"
                                name="ownsHome"
                                checked={ownsHome === true}
                                onChange={() => setValue("ownsHome", true, { shouldValidate: true })}
                            />
                            <span>Yes</span>
                        </label>
                        <label className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50 w-full">
                            <input
                                type="radio"
                                name="ownsHome"
                                checked={ownsHome === false}
                                onChange={() => setValue("ownsHome", false, { shouldValidate: true })}
                            />
                            <span>No</span>
                        </label>
                    </div>
                </div>

                {(ownsHome === true) && (
                    <div className="space-y-4 border-l-4 border-primary pl-4 py-2 bg-gray-50/50">
                        <div className="space-y-2">
                            <Label>Is it paid off?</Label>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="isPaidOff"
                                        checked={isPaidOff === true}
                                        onChange={() => setValue("homeDetails.isPaidOff", true, { shouldValidate: true })}
                                    />
                                    <span>Yes</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="isPaidOff"
                                        checked={isPaidOff === false}
                                        onChange={() => setValue("homeDetails.isPaidOff", false, { shouldValidate: true })}
                                    />
                                    <span>No</span>
                                </label>
                            </div>
                        </div>

                        {(isPaidOff === false) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Mortgage Balance Remaining</Label>
                                    <Input type="number" {...register("homeDetails.mortgageBalance")} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Loan Company Name</Label>
                                    <Input {...register("homeDetails.loanCompany")} />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-4 pt-6 border-t">
                <h2 className="text-xl font-semibold">Loan Type</h2>
                <p className="text-sm text-gray-500">Select the type of loan you are applying for</p>

                {/* Custom Radio Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="relative flex flex-col p-4 bg-white border rounded-lg shadow-sm cursor-pointer hover:border-primary focus-within:ring-2 focus-within:ring-primary">
                        <div className="flex items-center mb-2">
                            <input type="radio" value="PERSONAL_LOAN" {...register("loanType")} className="h-4 w-4 text-primary" />
                            <span className="ml-2 font-semibold">Personal Loan</span>
                        </div>
                        <span className="text-xs text-gray-500">For general personal expenses.</span>
                    </label>

                    <label className="relative flex flex-col p-4 bg-white border rounded-lg shadow-sm cursor-pointer hover:border-primary focus-within:ring-2 focus-within:ring-primary">
                        <div className="flex items-center mb-2">
                            <input type="radio" value="DEBT_CONSOLIDATION" {...register("loanType")} className="h-4 w-4 text-primary" />
                            <span className="ml-2 font-semibold">Debt Consolidation</span>
                        </div>
                        <span className="text-xs text-gray-500">Combine debts into one payment.</span>
                    </label>

                    <label className="relative flex flex-col p-4 bg-white border rounded-lg shadow-sm cursor-pointer hover:border-primary focus-within:ring-2 focus-within:ring-primary">
                        <div className="flex items-center mb-2">
                            <input type="radio" value="HOME_EQUITY" {...register("loanType")} className="h-4 w-4 text-primary" />
                            <span className="ml-2 font-semibold">Home Equity</span>
                        </div>
                        <span className="text-xs text-gray-500">Leverage your home&apos;s value.</span>
                    </label>
                </div>
                {errors.loanType && <p className="text-sm text-red-500">{errors.loanType.message as string}</p>}

                <div className="pt-4">
                    <Label htmlFor="amountRequested">Amount Requested</Label>
                    <Input id="amountRequested" type="number" {...register("amountRequested")} prefix="$" className="mt-2 max-w-xs" />
                    {errors.amountRequested && <p className="text-sm text-red-500">{errors.amountRequested.message as string}</p>}
                </div>
            </div>
        </div>
    );
}
