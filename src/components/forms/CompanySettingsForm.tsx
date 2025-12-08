"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const companyFormSchema = z.object({
    name: z.string().min(2, "Company name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    address: z.string().optional(),
    logo_url: z.string().url("Invalid URL").optional().or(z.literal("")),
    default_admin_fee_percent: z.string().optional().or(z.number()),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanySettingsFormProps {
    initialData: {
        name: string;
        email: string;
        phone: string | null;
        address: string | null;
        logo_url: string | null;
        default_admin_fee_percent: number | string | null;
    };
}

export function CompanySettingsForm({ initialData }: CompanySettingsFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(companyFormSchema),
        defaultValues: {
            name: initialData.name,
            email: initialData.email,
            phone: initialData.phone || "",
            address: initialData.address || "",
            logo_url: initialData.logo_url || "",
            default_admin_fee_percent: initialData.default_admin_fee_percent?.toString() || "",
        },
    });

    async function onSubmit(data: CompanyFormValues) {
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/company", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to update settings");
            }

            setMessage({ type: "success", text: "Settings updated successfully." });
            router.refresh();
        } catch (error) {
            setMessage({ type: "error", text: error instanceof Error ? error.message : "Something went wrong" });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg border shadow-sm">
            {message && (
                <div className={`p-3 rounded-md text-sm ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input id="name" {...form.register("name")} disabled={isLoading} />
                    {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" {...form.register("email")} disabled={isLoading} />
                    {form.formState.errors.email && (
                        <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" {...form.register("phone")} disabled={isLoading} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" {...form.register("address")} disabled={isLoading} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="logo_url">Logo URL</Label>
                    <Input id="logo_url" placeholder="https://..." {...form.register("logo_url")} disabled={isLoading} />
                    {form.formState.errors.logo_url && (
                        <p className="text-sm text-red-500">{form.formState.errors.logo_url.message}</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="default_admin_fee_percent">Default Admin Fee (%)</Label>
                    <Input
                        id="default_admin_fee_percent"
                        type="number"
                        step="0.01"
                        placeholder="e.g. 10"
                        {...form.register("default_admin_fee_percent")}
                        disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">This percentage will be used as a default for new funding details.</p>
                </div>
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </form>
    );
}
