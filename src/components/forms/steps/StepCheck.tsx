"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const checkSchema = z.object({
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number required"),
});

type CheckFormValues = z.infer<typeof checkSchema>;

interface StepCheckProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onComplete: (data: { email: string; phone: string; existingLead?: any }) => void;
}

export function StepCheck({ onComplete }: StepCheckProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckFormValues>({
        resolver: zodResolver(checkSchema),
    });

    const onSubmit = async (data: CheckFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/leads/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error || "Something went wrong");
                setIsLoading(false);
                return;
            }

            onComplete({
                email: data.email,
                phone: data.phone,
                existingLead: result.exists ? result.lead : undefined,
            });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError("Failed to check status. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Let&apos;s Get Started</h2>
                <p className="text-muted-foreground">
                    Enter your email and phone to check for existing applications.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="XXXXXXXXXX"
                        {...register("phone")}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                            e.target.value = val;
                        }}
                    />
                    <p className="text-xs text-muted-foreground">10 digits, numbers only</p>
                    {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue
                </Button>
            </form>
        </div>
    );
}
