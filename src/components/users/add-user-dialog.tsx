"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const userSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["ADMIN", "AGENT"]),
});

type UserFormValues = z.infer<typeof userSchema>;

export function AddUserDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: { role: "AGENT" }
    });

    const onSubmit = async (data: UserFormValues) => {
        setLoading(true);
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setOpen(false);
                reset();
                router.refresh();
            } else {
                alert("Failed to create user");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                    <DialogDescription>
                        Create a new user account for your organization.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>First Name</Label>
                            <Input {...register("firstName")} />
                            {errors.firstName && <span className="text-red-500 text-xs text-right block">{errors.firstName.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label>Last Name</Label>
                            <Input {...register("lastName")} />
                            {errors.lastName && <span className="text-red-500 text-xs text-right block">{errors.lastName.message}</span>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" {...register("email")} />
                        {errors.email && <span className="text-red-500 text-xs text-right block">{errors.email.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label>Password</Label>
                        <Input type="password" {...register("password")} />
                        {errors.password && <span className="text-red-500 text-xs text-right block">{errors.password.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Select onValueChange={(v) => setValue("role", v as "ADMIN" | "AGENT")} defaultValue="AGENT">
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AGENT">Agent</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
