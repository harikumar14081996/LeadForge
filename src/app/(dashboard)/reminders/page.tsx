"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Megaphone, Plus, Check, X, Clock, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Reminder {
    id: string;
    title: string;
    content: string;
    type: string;
    is_active: boolean;
    created_at: string;
    creator: {
        id: string;
        first_name: string;
        last_name: string;
    };
}

interface RecipientStats {
    total: number;
    done: number;
    dismissed: number;
    pending: number;
}

interface Recipient {
    id: string;
    status: string;
    responded_at: string | null;
    user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
}

export default function RemindersPage() {
    const { data: session } = useSession();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [selectedReminder, setSelectedReminder] = useState<string | null>(null);
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [stats, setStats] = useState<RecipientStats | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState<"COMPANY_WIDE" | "PERSONAL">("COMPANY_WIDE");

    const fetchReminders = useCallback(async () => {
        try {
            const res = await fetch("/api/reminders/admin");
            if (res.ok) {
                const data = await res.json();
                setReminders(data);
            }
        } catch (error) {
            console.error("Failed to fetch reminders:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReminders();
    }, [fetchReminders]);

    const createReminder = async () => {
        if (!title.trim() || !content.trim()) return;

        setCreating(true);
        try {
            const res = await fetch("/api/reminders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, type }),
            });

            if (res.ok) {
                setTitle("");
                setContent("");
                setShowCreate(false);
                fetchReminders();
            }
        } catch (error) {
            console.error("Failed to create reminder:", error);
        } finally {
            setCreating(false);
        }
    };

    const viewRecipients = async (reminderId: string) => {
        setSelectedReminder(reminderId);
        try {
            const res = await fetch(`/api/reminders/${reminderId}/recipients`);
            if (res.ok) {
                const data = await res.json();
                setRecipients(data.reminder.recipients);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Failed to fetch recipients:", error);
        }
    };

    // Check if user is admin
    if (session?.user?.role !== "ADMIN") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <AlertCircle className="h-16 w-16 text-slate-300 mb-4" />
                <h2 className="text-xl font-semibold text-slate-700">Admin Access Required</h2>
                <p className="text-slate-500 mt-2">Only company admins can manage reminders.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Reminders & Announcements</h1>
                    <p className="text-slate-600 mt-1">
                        Send company-wide announcements and track acknowledgments
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreate(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Announcement
                </Button>
            </div>

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreate(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            Create New Announcement
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Title
                                </label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter announcement title..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Enter your message..."
                                    rows={4}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Type
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setType("COMPANY_WIDE")}
                                        className={cn(
                                            "flex-1 p-3 rounded-lg border-2 transition-all",
                                            type === "COMPANY_WIDE"
                                                ? "border-amber-500 bg-amber-50"
                                                : "border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        <Megaphone className={cn(
                                            "h-5 w-5 mx-auto mb-1",
                                            type === "COMPANY_WIDE" ? "text-amber-600" : "text-slate-400"
                                        )} />
                                        <div className="text-sm font-medium">Company-Wide</div>
                                        <div className="text-xs text-slate-500">All users</div>
                                    </button>
                                    <button
                                        onClick={() => setType("PERSONAL")}
                                        className={cn(
                                            "flex-1 p-3 rounded-lg border-2 transition-all",
                                            type === "PERSONAL"
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        <Clock className={cn(
                                            "h-5 w-5 mx-auto mb-1",
                                            type === "PERSONAL" ? "text-blue-600" : "text-slate-400"
                                        )} />
                                        <div className="text-sm font-medium">Personal</div>
                                        <div className="text-xs text-slate-500">Just me</div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button
                                onClick={() => setShowCreate(false)}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={createReminder}
                                disabled={creating || !title.trim() || !content.trim()}
                                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500"
                            >
                                {creating ? "Creating..." : "Send Announcement"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reminders List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="flex gap-1">
                        <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            ) : reminders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Megaphone className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">No announcements yet</h3>
                    <p className="text-slate-500 mt-1">
                        Create your first company-wide announcement
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {reminders.map((reminder) => (
                        <div
                            key={reminder.id}
                            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={cn(
                                        "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
                                        reminder.type === "COMPANY_WIDE"
                                            ? "bg-gradient-to-br from-amber-500 to-orange-500"
                                            : "bg-gradient-to-br from-blue-500 to-blue-600"
                                    )}>
                                        {reminder.type === "COMPANY_WIDE"
                                            ? <Megaphone className="h-5 w-5 text-white" />
                                            : <Clock className="h-5 w-5 text-white" />
                                        }
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            {reminder.title}
                                        </h3>
                                        <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                                            {reminder.content}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                            <span>
                                                {formatDistanceToNow(new Date(reminder.created_at), { addSuffix: true })}
                                            </span>
                                            <span>•</span>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full",
                                                reminder.type === "COMPANY_WIDE"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-blue-100 text-blue-700"
                                            )}>
                                                {reminder.type === "COMPANY_WIDE" ? "Company-Wide" : "Personal"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {reminder.type === "COMPANY_WIDE" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => viewRecipients(reminder.id)}
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        View Status
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Recipients Modal */}
            {selectedReminder && stats && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedReminder(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">
                                Acknowledgment Status
                            </h2>
                            <div className="flex gap-4 mt-4">
                                <div className="flex-1 bg-slate-100 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                                    <div className="text-xs text-slate-500">Total</div>
                                </div>
                                <div className="flex-1 bg-green-100 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-green-600">{stats.done}</div>
                                    <div className="text-xs text-green-600">Done</div>
                                </div>
                                <div className="flex-1 bg-slate-100 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-slate-500">{stats.dismissed}</div>
                                    <div className="text-xs text-slate-500">Dismissed</div>
                                </div>
                                <div className="flex-1 bg-amber-100 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                                    <div className="text-xs text-amber-600">Pending</div>
                                </div>
                            </div>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto p-4">
                            {recipients.map((recipient) => (
                                <div
                                    key={recipient.id}
                                    className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium text-sm">
                                            {recipient.user.first_name[0]}{recipient.user.last_name[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">
                                                {recipient.user.first_name} {recipient.user.last_name}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {recipient.user.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                                        recipient.status === "DONE" && "bg-green-100 text-green-700",
                                        recipient.status === "DISMISSED" && "bg-slate-100 text-slate-600",
                                        recipient.status === "PENDING" && "bg-amber-100 text-amber-700"
                                    )}>
                                        {recipient.status === "DONE" && <Check className="h-3 w-3" />}
                                        {recipient.status === "DISMISSED" && <X className="h-3 w-3" />}
                                        {recipient.status === "PENDING" && <Clock className="h-3 w-3" />}
                                        {recipient.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-slate-200">
                            <Button
                                onClick={() => setSelectedReminder(null)}
                                className="w-full"
                                variant="outline"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
