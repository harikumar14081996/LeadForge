
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Lock, UserX, UserCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserActionsProps {
    user: {
        id: string;
        email: string;
        is_active: boolean;
        role: string;
    }
}

export function UserActions({ user }: UserActionsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    const toggleStatus = async () => {
        if (!confirm(`Are you sure you want to ${user.is_active ? 'deactivate' : 'activate'} this user?`)) return;

        setIsLoading(true);
        try {
            await fetch(`/api/users/${user.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    action: "toggle_status",
                    isActive: !user.is_active
                })
            });
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    action: "reset_password",
                    password: newPassword
                })
            });

            if (res.ok) {
                setShowPasswordDialog(false);
                setNewPassword("");
                alert("Password updated successfully");
            } else {
                alert("Failed to update password");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setShowPasswordDialog(true)}>
                        <Lock className="mr-2 h-4 w-4" /> Change Password
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleStatus} className={user.is_active ? "text-red-600" : "text-green-600"}>
                        {user.is_active ? (
                            <>
                                <UserX className="mr-2 h-4 w-4" /> Deactivate
                            </>
                        ) : (
                            <>
                                <UserCheck className="mr-2 h-4 w-4" /> Activate
                            </>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                            Enter a new password for {user.email}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>New Password</Label>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Checking123!"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
                        <Button onClick={resetPassword} disabled={isLoading || newPassword.length < 6}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
