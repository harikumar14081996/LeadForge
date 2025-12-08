"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 text-center shadow-xl border border-slate-100">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Something went wrong!
                    </h2>
                    <p className="mt-2 text-slate-500">
                        We apologize for the inconvenience. An unexpected error has occurred.
                    </p>
                </div>
                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={() => reset()}
                        className="bg-slate-900 text-white hover:bg-slate-800"
                    >
                        Try again
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = "/"}
                    >
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
