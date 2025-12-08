"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ApplicationWizard } from "@/components/forms/ApplicationWizard";

interface AddLeadDialogProps {
    userId: string;
}

export function AddLeadDialog({ userId }: AddLeadDialogProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSuccess = () => {
        setOpen(false);
        router.refresh();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Lead
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Add New Lead</DialogTitle>
                    <DialogDescription>
                        Manually enter lead details. The lead will be assigned to you.
                    </DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto flex-1 p-6 pt-2">
                    <ApplicationWizard
                        isInternal={true}
                        userId={userId}
                        onSuccess={handleSuccess}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
