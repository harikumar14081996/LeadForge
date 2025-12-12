"use client";

import { useState, useEffect } from "react";
import { Mail, Save, Loader2, Signature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const EMAIL_PROVIDERS = [
    { value: "GMAIL", label: "Gmail", color: "from-red-500 to-red-600" },
    { value: "OUTLOOK", label: "Outlook", color: "from-blue-500 to-blue-600" },
    { value: "YAHOO", label: "Yahoo Mail", color: "from-purple-500 to-purple-600" },
    { value: "ICLOUD", label: "iCloud Mail", color: "from-gray-500 to-gray-600" },
    { value: "PROTONMAIL", label: "ProtonMail", color: "from-violet-500 to-violet-600" },
];

interface EmailSettings {
    email_provider: string;
    email_subject: string | null;
    email_body: string | null;
    email_signature: string | null;
}

export function EmailSettingsForm() {
    const [settings, setSettings] = useState<EmailSettings>({
        email_provider: "GMAIL",
        email_subject: "Regarding Your Loan Application",
        email_body: "",
        email_signature: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/profile/email-settings");
                if (res.ok) {
                    const data = await res.json();
                    setSettings({
                        email_provider: data.email_provider || "GMAIL",
                        email_subject: data.email_subject || "Regarding Your Loan Application",
                        email_body: data.email_body || getDefaultBody(),
                        email_signature: data.email_signature || getDefaultSignature(),
                    });
                }
            } catch (error) {
                console.error("Failed to fetch email settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            const res = await fetch("/api/profile/email-settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error("Failed to save email settings:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Provider Selection */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                    Email Service Provider
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {EMAIL_PROVIDERS.map((provider) => (
                        <button
                            key={provider.value}
                            onClick={() => setSettings({ ...settings, email_provider: provider.value })}
                            className={cn(
                                "p-3 rounded-xl border-2 transition-all text-center",
                                settings.email_provider === provider.value
                                    ? `border-slate-900 bg-gradient-to-br ${provider.color} text-white shadow-lg`
                                    : "border-slate-200 hover:border-slate-300 bg-white"
                            )}
                        >
                            <Mail className={cn(
                                "h-5 w-5 mx-auto mb-1",
                                settings.email_provider === provider.value ? "text-white" : "text-slate-500"
                            )} />
                            <div className="text-xs font-medium">{provider.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Subject Template */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Subject Template
                </label>
                <div className="text-xs text-slate-500 mb-2">
                    Use <code className="bg-slate-100 px-1 rounded">{"{name}"}</code> for lead name, <code className="bg-slate-100 px-1 rounded">{"{loan_type}"}</code> for loan type
                </div>
                <Input
                    value={settings.email_subject || ""}
                    onChange={(e) => setSettings({ ...settings, email_subject: e.target.value })}
                    placeholder="e.g., Regarding Your {loan_type} Application"
                />
            </div>

            {/* Body Template */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Body Template
                </label>
                <div className="text-xs text-slate-500 mb-2">
                    Your message content. Use placeholders for personalization.
                </div>
                <textarea
                    value={settings.email_body || ""}
                    onChange={(e) => setSettings({ ...settings, email_body: e.target.value })}
                    rows={6}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dear {name},&#10;&#10;Thank you for your interest..."
                />
            </div>

            {/* Email Signature */}
            <div className="border-t border-slate-200 pt-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                    <Signature className="h-4 w-4" />
                    Email Signature
                </label>
                <div className="text-xs text-slate-500 mb-2">
                    Your professional signature will be appended to every email. Include your name, title, company, and contact info.
                </div>
                <textarea
                    value={settings.email_signature || ""}
                    onChange={(e) => setSettings({ ...settings, email_signature: e.target.value })}
                    rows={6}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Best regards,&#10;&#10;John Smith&#10;Senior Loan Officer&#10;H Financial Services&#10;📞 (555) 123-4567&#10;📧 john@hfinancial.com"
                />
                <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-xs font-medium text-slate-500 mb-2">Preview:</div>
                    <div className="text-sm text-slate-700 whitespace-pre-wrap">
                        {settings.email_signature || "No signature set"}
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-500 to-blue-600"
                >
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Email Settings
                        </>
                    )}
                </Button>
                {saved && (
                    <span className="text-green-600 text-sm font-medium animate-in fade-in">
                        ✓ Settings saved successfully
                    </span>
                )}
            </div>
        </div>
    );
}

function getDefaultBody(): string {
    return `Dear {name},

Thank you for your interest in our {loan_type} services.

I wanted to follow up with you regarding your loan application. Please let me know if you have any questions or if there's anything I can help you with.

Looking forward to hearing from you.`;
}

function getDefaultSignature(): string {
    return `Best regards,

[Your Name]
Loan Officer
[Your Company]
📞 [Your Phone]
📧 [Your Email]`;
}

