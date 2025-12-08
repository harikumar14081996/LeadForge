"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
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

interface EditLeadDialogProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lead: any;
    userId: string;
}

export function EditLeadDialog({ lead, userId }: EditLeadDialogProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSuccess = () => {
        setOpen(false);
        router.refresh();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Pencil className="mr-2 h-4 w-4" /> Edit Lead
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 gap-0 z-[100]">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Edit Lead Details</DialogTitle>
                    <DialogDescription>
                        Update lead information. Validation rules apply.
                    </DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto flex-1 p-6 pt-2">
                    <ApplicationWizard
                        isInternal={true}
                        userId={userId}
                        onSuccess={handleSuccess}
                        initialData={lead}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
