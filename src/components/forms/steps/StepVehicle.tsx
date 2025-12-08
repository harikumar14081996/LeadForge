"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StepVehicle() {
    const { register, watch, setValue } = useFormContext();
    const ownsVehicle = watch("ownsVehicle");
    const hasLien = watch("vehicleDetails.hasLien");

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Do you own a vehicle?</Label>
                <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                            type="radio"
                            name="ownsVehicle"
                            checked={ownsVehicle === true}
                            onChange={() => setValue("ownsVehicle", true, { shouldValidate: true })}
                        />
                        <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                            type="radio"
                            name="ownsVehicle"
                            checked={ownsVehicle === false}
                            onChange={() => setValue("ownsVehicle", false, { shouldValidate: true })}
                        />
                        <span>No</span>
                    </label>
                </div>
            </div>

            {(ownsVehicle === true) && (
                <div className="space-y-4 border-l-4 border-primary pl-4 py-2 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Make</Label>
                            <Input {...register("vehicleDetails.make")} placeholder="e.g. Toyota" />
                        </div>
                        <div className="space-y-2">
                            <Label>Model</Label>
                            <Input {...register("vehicleDetails.model")} placeholder="e.g. Camry" />
                        </div>
                        <div className="space-y-2">
                            <Label>Year</Label>
                            <Input type="number" {...register("vehicleDetails.year")} placeholder="2020" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Odometer Reading</Label>
                        <Input type="number" {...register("vehicleDetails.odometer")} placeholder="e.g. 50000" />
                    </div>

                    <div className="space-y-2">
                        <Label>Is there a lien on the vehicle?</Label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="hasLien"
                                    checked={hasLien === true}
                                    onChange={() => setValue("vehicleDetails.hasLien", true, { shouldValidate: true })}
                                />
                                <span>Yes</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="hasLien"
                                    checked={hasLien === false}
                                    onChange={() => setValue("vehicleDetails.hasLien", false, { shouldValidate: true })}
                                />
                                <span>No</span>
                            </label>
                        </div>
                    </div>

                    {(hasLien === true) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Bank/Lender Name</Label>
                                <Input {...register("vehicleDetails.lienBank")} />
                            </div>
                            <div className="space-y-2">
                                <Label>Balance Remaining</Label>
                                <Input type="number" {...register("vehicleDetails.lienBalance")} prefix="$" />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
