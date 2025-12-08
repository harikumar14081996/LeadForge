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

const profileFormSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    tempPassword: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileSettingsFormProps {
    initialData: {
        firstName: string;
        lastName: string;
        email: string;
        avatarUrl: string | null;
    };
}

export function ProfileSettingsForm({ initialData }: ProfileSettingsFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: initialData.firstName,
            lastName: initialData.lastName,
            email: initialData.email,
            avatarUrl: initialData.avatarUrl || "",
            tempPassword: "",
        },
    });

    async function onSubmit(data: ProfileFormValues) {
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to update profile");
            }

            setMessage({ type: "success", text: "Profile updated successfully." });
            router.refresh();
            form.setValue("tempPassword", ""); // Clear password field
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
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" {...form.register("firstName")} disabled={isLoading} />
                        {form.formState.errors.firstName && (
                            <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" {...form.register("lastName")} disabled={isLoading} />
                        {form.formState.errors.lastName && (
                            <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" {...form.register("email")} disabled={isLoading} />
                    {form.formState.errors.email && (
                        <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input id="avatarUrl" placeholder="https://..." {...form.register("avatarUrl")} disabled={isLoading} />
                    {form.formState.errors.avatarUrl && (
                        <p className="text-sm text-red-500">{form.formState.errors.avatarUrl.message}</p>
                    )}
                </div>

                <div className="pt-4 border-t">
                    <h3 className="text-md font-medium mb-3">Change Password</h3>
                    <div className="grid gap-2">
                        <Label htmlFor="tempPassword">New Password (Optional)</Label>
                        <Input id="tempPassword" type="password" {...form.register("tempPassword")} disabled={isLoading} />
                        {form.formState.errors.tempPassword && (
                            <p className="text-sm text-red-500">{form.formState.errors.tempPassword.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Leave blank to keep current password.</p>
                    </div>
                </div>
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </form>
    );
}
