"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardError({
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
        <div className="flex h-full items-center justify-center p-6">
            <Card className="w-full max-w-lg border-red-200 shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-xl text-slate-900">Dashboard Error</CardTitle>
                    <CardDescription>
                        We encountered an issue loading this section of the dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-8">
                    <Button
                        onClick={() => reset()}
                        className="bg-red-600 hover:bg-red-700 text-white gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Reload Dashboard
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
