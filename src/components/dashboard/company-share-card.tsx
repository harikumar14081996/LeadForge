"use client";

import { useState, useEffect } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface CompanyShareCardProps {
    companyId: string;
}

export function CompanyShareCard({ companyId }: CompanyShareCardProps) {
    const [copied, setCopied] = useState(false);
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const shareUrl = `${origin}/apply?company=${companyId}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Application Link</CardTitle>
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <Share2 className="h-4 w-4 text-indigo-600" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mt-2">
                    <Input
                        readOnly
                        value={origin ? shareUrl : "Loading..."}
                        className="bg-slate-50 font-mono text-xs text-slate-600"
                    />
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={handleCopy}
                        className="shrink-0"
                        title="Copy to clipboard"
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-green-600" />
                        ) : (
                            <Copy className="h-4 w-4 text-slate-500" />
                        )}
                    </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Share this link with customers to start a new application.
                </p>
            </CardContent>
        </Card>
    );
}
