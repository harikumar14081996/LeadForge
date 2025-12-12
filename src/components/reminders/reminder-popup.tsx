"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Check, X, Megaphone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPusherClient } from "@/lib/pusher";
import { formatDistanceToNow } from "date-fns";

interface Reminder {
    id: string;
    reminder: {
        id: string;
        title: string;
        content: string;
        type: string;
        created_at: string;
        creator: {
            id: string;
            first_name: string;
            last_name: string;
        };
    };
}

interface ToastReminder {
    id: string;
    title: string;
    content: string;
    creatorName?: string;
    type: string;
}

export function ReminderPopup() {
    const { data: session } = useSession();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [currentReminder, setCurrentReminder] = useState<Reminder | null>(null);
    const [toast, setToast] = useState<ToastReminder | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchReminders = useCallback(async () => {
        try {
            const res = await fetch("/api/reminders");
            if (res.ok) {
                const data = await res.json();
                setReminders(data);
                // Show the first pending reminder
                if (data.length > 0 && !currentReminder) {
                    setCurrentReminder(data[0]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch reminders:", error);
        }
    }, [currentReminder]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchReminders();
        }
    }, [session?.user?.id, fetchReminders]);

    // Auto-dismiss toast after 5 seconds
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Subscribe to real-time reminders
    useEffect(() => {
        if (!session?.user?.id) return;

        const pusher = getPusherClient();
        if (pusher) {
            const channel = pusher.subscribe(`user-${session.user.id}`);

            channel.bind("new-reminder", (data: ToastReminder) => {
                setToast(data);
                fetchReminders();
            });

            return () => {
                channel.unbind_all();
                pusher.unsubscribe(`user-${session.user.id}`);
            };
        }
    }, [session?.user?.id, fetchReminders]);

    const respondToReminder = async (status: "DONE" | "DISMISSED") => {
        if (!currentReminder) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/reminders/${currentReminder.reminder.id}/respond`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                // Remove from list and show next
                const newReminders = reminders.filter(r => r.id !== currentReminder.id);
                setReminders(newReminders);
                setCurrentReminder(newReminders.length > 0 ? newReminders[0] : null);
            }
        } catch (error) {
            console.error("Failed to respond to reminder:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Toast for new reminder */}
            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top-5 fade-in duration-300">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-2xl p-4 min-w-[360px] max-w-md flex items-start gap-3 text-white">
                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                            <Megaphone className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-lg">
                                {toast.type === "COMPANY_WIDE" ? "📢 Company Announcement" : "⏰ Reminder"}
                            </div>
                            <div className="font-semibold text-white/90">
                                {toast.title}
                            </div>
                            {toast.creatorName && (
                                <div className="text-sm text-white/70 mt-1">
                                    From {toast.creatorName}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setToast(null)}
                            className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Reminder Modal */}
            {currentReminder && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 fade-in duration-200">
                        {/* Header */}
                        <div className={cn(
                            "rounded-t-2xl p-6 text-white",
                            currentReminder.reminder.type === "COMPANY_WIDE"
                                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                : "bg-gradient-to-r from-blue-500 to-blue-600"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                    {currentReminder.reminder.type === "COMPANY_WIDE"
                                        ? <Megaphone className="h-6 w-6" />
                                        : <Clock className="h-6 w-6" />
                                    }
                                </div>
                                <div>
                                    <div className="text-sm text-white/80">
                                        {currentReminder.reminder.type === "COMPANY_WIDE"
                                            ? "Company Announcement"
                                            : "Personal Reminder"}
                                    </div>
                                    <div className="font-bold text-xl">
                                        {currentReminder.reminder.title}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {currentReminder.reminder.content}
                            </p>

                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                <span>
                                    From {currentReminder.reminder.creator.first_name} {currentReminder.reminder.creator.last_name}
                                </span>
                                <span>•</span>
                                <span>
                                    {formatDistanceToNow(new Date(currentReminder.reminder.created_at), { addSuffix: true })}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="px-6 pb-6 flex gap-3">
                            <Button
                                onClick={() => respondToReminder("DONE")}
                                disabled={loading}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                            >
                                <Check className="h-4 w-4 mr-2" />
                                Done
                            </Button>
                            <Button
                                onClick={() => respondToReminder("DISMISSED")}
                                disabled={loading}
                                variant="outline"
                                className="flex-1"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Dismiss
                            </Button>
                        </div>

                        {/* Remaining count */}
                        {reminders.length > 1 && (
                            <div className="px-6 pb-4 text-center text-sm text-slate-500">
                                {reminders.length - 1} more reminder{reminders.length > 2 ? "s" : ""} remaining
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
