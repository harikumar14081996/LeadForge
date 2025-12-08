"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CopyButtonProps {
    value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex space-x-2">
            <Input value={value} readOnly className="bg-gray-50" />
            <Button variant="outline" className="shrink-0" onClick={onCopy}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied" : "Copy Link"}
            </Button>
        </div>
    );
}
