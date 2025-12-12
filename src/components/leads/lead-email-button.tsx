"use client";

import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LeadEmailButtonProps {
    leadEmail: string;
    leadName: string;
    loanType: string;
}

interface EmailSettings {
    email_provider: string;
    email_subject: string | null;
    email_body: string | null;
    email_signature: string | null;
}

export function LeadEmailButton({ leadEmail, leadName, loanType }: LeadEmailButtonProps) {
    const [settings, setSettings] = useState<EmailSettings | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch user's email settings
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/profile/email-settings");
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error("Failed to fetch email settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const handleSendEmail = () => {
        if (!settings) return;

        setLoading(true);

        // Default templates with placeholders
        let subject = settings.email_subject || "Regarding Your Loan Application";
        let body = settings.email_body || getDefaultEmailBody(leadName, loanType);
        const signature = settings.email_signature || "";

        // Replace placeholders
        subject = subject.replace(/\{name\}/gi, leadName);
        subject = subject.replace(/\{loan_type\}/gi, loanType.replace(/_/g, " "));
        body = body.replace(/\{name\}/gi, leadName);
        body = body.replace(/\{loan_type\}/gi, loanType.replace(/_/g, " "));

        // Combine body with signature
        const fullBody = signature ? `${body}\n\n${signature}` : body;

        // Use mailto: link - opens user's default email client
        const mailtoUrl = `mailto:${leadEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;

        // Trigger native email client
        window.location.href = mailtoUrl;

        setLoading(false);
    };

    return (
        <Button
            onClick={handleSendEmail}
            disabled={loading || !settings}
            className={cn(
                "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                "text-white shadow-md"
            )}
        >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
        </Button>
    );
}

function getDefaultEmailBody(leadName: string, loanType: string): string {
    return `Dear ${leadName},

Thank you for your interest in our ${loanType.replace(/_/g, " ")} services.

I wanted to follow up with you regarding your loan application. Please let me know if you have any questions or if there's anything I can help you with.

Looking forward to hearing from you.`;
}


