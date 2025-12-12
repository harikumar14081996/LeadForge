"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Clock, Plus, Check, X, Megaphone, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Reminder {
    id: string;
    reminder: {
        id: string;
        title: string;
        content: string;
        type: string;
        is_recurring: boolean;
        recurrence: string | null;
        time_of_day: string | null;
        created_at: string;
        creator: {
            id: string;
            first_name: string;
            last_name: string;
        };
    };
    status: string;
}

export default function MyRemindersPage() {
    useSession(); // For authentication check
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrence, setRecurrence] = useState<"DAILY" | "WEEKLY" | "SPECIFIC_DAYS">("DAILY");
    const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 2, 3, 4, 5]);
    const [timeOfDay, setTimeOfDay] = useState("09:00");

    const fetchReminders = useCallback(async () => {
        try {
            const res = await fetch("/api/reminders");
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

    const toggleDay = (day: number) => {
        if (daysOfWeek.includes(day)) {
            setDaysOfWeek(daysOfWeek.filter(d => d !== day));
        } else {
            setDaysOfWeek([...daysOfWeek, day].sort());
        }
    };

    const createReminder = async () => {
        if (!title.trim() || !content.trim()) return;

        setCreating(true);
        try {
            const res = await fetch("/api/reminders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    type: "PERSONAL", // Loan officers can only create personal
                    isRecurring,
                    recurrence: isRecurring ? recurrence : null,
                    daysOfWeek: isRecurring && recurrence === "SPECIFIC_DAYS" ? daysOfWeek.join(",") : null,
                    timeOfDay: isRecurring ? timeOfDay : null,
                }),
            });

            if (res.ok) {
                setTitle("");
                setContent("");
                setIsRecurring(false);
                setShowCreate(false);
                fetchReminders();
            }
        } catch (error) {
            console.error("Failed to create reminder:", error);
        } finally {
            setCreating(false);
        }
    };

    const respondToReminder = async (reminderId: string, status: "DONE" | "DISMISSED") => {
        try {
            const res = await fetch(`/api/reminders/${reminderId}/respond`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                fetchReminders();
            }
        } catch (error) {
            console.error("Failed to respond to reminder:", error);
        }
    };

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Reminders</h1>
                    <p className="text-slate-600 mt-1">
                        Set personal reminders to stay on track
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreate(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Reminder
                </Button>
            </div>

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreate(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            Create Personal Reminder
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Title
                                </label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Follow up with client..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Details
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Add any notes or details..."
                                    rows={3}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Recurring Toggle */}
                            <div className="pt-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className={cn(
                                        "w-12 h-6 rounded-full transition-colors relative",
                                        isRecurring ? "bg-blue-500" : "bg-slate-200"
                                    )} onClick={() => setIsRecurring(!isRecurring)}>
                                        <div className={cn(
                                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow",
                                            isRecurring ? "translate-x-7" : "translate-x-1"
                                        )} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">
                                        Repeat this reminder
                                    </span>
                                </label>
                            </div>

                            {/* Recurring Options */}
                            {isRecurring && (
                                <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Repeat
                                        </label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setRecurrence("DAILY")}
                                                className={cn(
                                                    "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                                                    recurrence === "DAILY"
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-white border border-slate-200 text-slate-600"
                                                )}
                                            >
                                                Daily
                                            </button>
                                            <button
                                                onClick={() => setRecurrence("WEEKLY")}
                                                className={cn(
                                                    "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                                                    recurrence === "WEEKLY"
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-white border border-slate-200 text-slate-600"
                                                )}
                                            >
                                                Weekly
                                            </button>
                                            <button
                                                onClick={() => setRecurrence("SPECIFIC_DAYS")}
                                                className={cn(
                                                    "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                                                    recurrence === "SPECIFIC_DAYS"
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-white border border-slate-200 text-slate-600"
                                                )}
                                            >
                                                Custom
                                            </button>
                                        </div>
                                    </div>

                                    {/* Day Picker */}
                                    {recurrence === "SPECIFIC_DAYS" && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Select Days
                                            </label>
                                            <div className="flex gap-1">
                                                {dayNames.map((name, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => toggleDay(idx)}
                                                        className={cn(
                                                            "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                                                            daysOfWeek.includes(idx)
                                                                ? "bg-blue-500 text-white"
                                                                : "bg-white border border-slate-200 text-slate-500"
                                                        )}
                                                    >
                                                        {name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Time Picker */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Remind me at
                                        </label>
                                        <input
                                            type="time"
                                            value={timeOfDay}
                                            onChange={(e) => setTimeOfDay(e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            )}
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
                                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600"
                            >
                                {creating ? "Creating..." : (isRecurring ? "Schedule" : "Create")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reminders List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="flex gap-1">
                        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            ) : reminders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Clock className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">No reminders</h3>
                    <p className="text-slate-500 mt-1">
                        Create your first personal reminder
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {reminders.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={cn(
                                        "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
                                        item.reminder.type === "COMPANY_WIDE"
                                            ? "bg-gradient-to-br from-amber-500 to-orange-500"
                                            : "bg-gradient-to-br from-blue-500 to-blue-600"
                                    )}>
                                        {item.reminder.type === "COMPANY_WIDE"
                                            ? <Megaphone className="h-5 w-5 text-white" />
                                            : <Clock className="h-5 w-5 text-white" />
                                        }
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            {item.reminder.title}
                                        </h3>
                                        <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                                            {item.reminder.content}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                            <span>
                                                {formatDistanceToNow(new Date(item.reminder.created_at), { addSuffix: true })}
                                            </span>
                                            {item.reminder.is_recurring && (
                                                <>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1 text-blue-600">
                                                        <RefreshCw className="h-3 w-3" />
                                                        {item.reminder.recurrence}
                                                    </span>
                                                </>
                                            )}
                                            <span>•</span>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full",
                                                item.reminder.type === "COMPANY_WIDE"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-blue-100 text-blue-700"
                                            )}>
                                                {item.reminder.type === "COMPANY_WIDE" ? "Announcement" : "Personal"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {item.status === "PENDING" && (
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="bg-green-500 hover:bg-green-600"
                                            onClick={() => respondToReminder(item.reminder.id, "DONE")}
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => respondToReminder(item.reminder.id, "DISMISSED")}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
