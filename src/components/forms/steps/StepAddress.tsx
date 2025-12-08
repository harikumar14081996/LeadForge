"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { MapPin, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Needs install

export function StepAddress() {
    const { register, setValue, watch, formState: { errors } } = useFormContext();
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoSuccess, setGeoSuccess] = useState(false);

    const latitude = watch("latitude");
    const longitude = watch("longitude");

    const captureLocation = () => {
        setGeoLoading(true);
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            setGeoLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setValue("latitude", position.coords.latitude);
                setValue("longitude", position.coords.longitude);
                setValue("locationAccuracy", position.coords.accuracy);
                setValue("locationCapturedAt", new Date().toISOString());
                setGeoSuccess(true);
                setGeoLoading(false);
            },
            (error) => {
                console.error("Geo error:", error);
                alert("Unable to retrieve your location");
                setGeoLoading(false);
            },
            { enableHighAccuracy: true }
        );
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input id="street" {...register("street")} />
                {errors.street && <p className="text-sm text-red-500">{errors.street.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} />
                    {errors.city && <p className="text-sm text-red-500">{errors.city.message as string}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="provinceState">Province/State</Label>
                    <select
                        {...register("provinceState")}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">Select...</option>
                        <optgroup label="Canada">
                            <option value="AB">Alberta</option>
                            <option value="BC">British Columbia</option>
                            <option value="MB">Manitoba</option>
                            <option value="NB">New Brunswick</option>
                            <option value="NL">Newfoundland and Labrador</option>
                            <option value="NS">Nova Scotia</option>
                            <option value="ON">Ontario</option>
                            <option value="PE">Prince Edward Island</option>
                            <option value="QC">Quebec</option>
                            <option value="SK">Saskatchewan</option>
                        </optgroup>
                        <optgroup label="USA">
                            <option value="CA">California</option>
                            <option value="NY">New York</option>
                            <option value="TX">Texas</option>
                            {/* Add all states properly in real app */}
                        </optgroup>
                    </select>
                    {errors.provinceState && <p className="text-sm text-red-500">{errors.provinceState.message as string}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <select
                        {...register("country")}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="Canada">Canada</option>
                        <option value="USA">USA</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="postalZip">Postal / ZIP Code</Label>
                    <Input id="postalZip" {...register("postalZip")} />
                    {errors.postalZip && <p className="text-sm text-red-500">{errors.postalZip.message as string}</p>}
                </div>
            </div>

            <div className="pt-4 border-t mt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={captureLocation}
                    disabled={geoLoading || geoSuccess}
                    className="w-full flex items-center justify-center gap-2"
                >
                    {geoLoading ? <Loader2 className="animate-spin h-4 w-4" /> : geoSuccess ? <Check className="h-4 w-4 text-green-500" /> : <MapPin className="h-4 w-4" />}
                    {geoSuccess ? "Location Captured" : "I am home"}
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    This will verify your location and address to help for address proof and process your application faster.
                </p>
                {geoSuccess && (
                    <p className="text-xs text-green-600 mt-2 text-center">
                        ✓ Location Captured: {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
                    </p>
                )}
            </div>
        </div>
    );
}
