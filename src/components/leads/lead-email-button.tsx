"use client";

import { useState, useEffect } from "react";
import { Mail, ExternalLink } from "lucide-react";
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
}

// Email provider compose URLs
const EMAIL_PROVIDERS = {
    GMAIL: {
        name: "Gmail",
        composeUrl: (to: string, subject: string, body: string) =>
            `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
        checkUrl: "https://mail.google.com",
    },
    OUTLOOK: {
        name: "Outlook",
        composeUrl: (to: string, subject: string, body: string) =>
            `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
        checkUrl: "https://outlook.live.com",
    },
    YAHOO: {
        name: "Yahoo Mail",
        composeUrl: (to: string, subject: string, body: string) =>
            `https://compose.mail.yahoo.com/?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
        checkUrl: "https://mail.yahoo.com",
    },
    ICLOUD: {
        name: "iCloud Mail",
        composeUrl: (to: string, subject: string, body: string) =>
            `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
        checkUrl: null, // iCloud uses mailto
    },
    PROTONMAIL: {
        name: "ProtonMail",
        composeUrl: (to: string, subject: string, body: string) =>
            `https://mail.proton.me/u/0/composer?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
        checkUrl: "https://mail.proton.me",
    },
};

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

        const provider = EMAIL_PROVIDERS[settings.email_provider as keyof typeof EMAIL_PROVIDERS] || EMAIL_PROVIDERS.GMAIL;

        // Default templates with placeholders
        let subject = settings.email_subject || "Regarding Your Loan Application";
        let body = settings.email_body || getDefaultEmailBody(leadName, loanType);

        // Replace placeholders
        subject = subject.replace(/\{name\}/gi, leadName);
        subject = subject.replace(/\{loan_type\}/gi, loanType.replace("_", " "));
        body = body.replace(/\{name\}/gi, leadName);
        body = body.replace(/\{loan_type\}/gi, loanType.replace("_", " "));

        // Generate compose URL
        const composeUrl = provider.composeUrl(leadEmail, subject, body);

        // Open in new tab
        window.open(composeUrl, "_blank");

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
            <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
        </Button>
    );
}

function getDefaultEmailBody(leadName: string, loanType: string): string {
    return `Dear ${leadName},

Thank you for your interest in our ${loanType.replace("_", " ")} services.

I wanted to follow up with you regarding your loan application. Please let me know if you have any questions or if there's anything I can help you with.

Looking forward to hearing from you.

Best regards`;
}
