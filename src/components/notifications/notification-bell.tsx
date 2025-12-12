"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Bell, Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getPusherClient } from "@/lib/pusher";
import { formatDistanceToNow } from "date-fns";

interface Notification {
    id: string;
    type: string;
    title: string;
    body: string;
    read: boolean;
    created_at: string;
    data?: { conversationId?: string };
}

export function NotificationBell() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }, []);

    useEffect(() => {
        if (session?.user?.id) {
            fetchNotifications();

            // Subscribe to real-time notifications
            const pusher = getPusherClient();
            if (pusher) {
                const channel = pusher.subscribe(`user-${session.user.id}`);
                channel.bind("notification", () => {
                    fetchNotifications();
                });

                return () => {
                    channel.unbind_all();
                    pusher.unsubscribe(`user-${session.user.id}`);
                };
            }
        }
    }, [session?.user?.id, fetchNotifications]);

    const markAllRead = async () => {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markAllRead: true }),
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "MENTION":
                return <span className="text-blue-600">@</span>;
            case "MESSAGE":
                return <MessageSquare className="h-4 w-4 text-green-600" />;
            default:
                return <Bell className="h-4 w-4 text-slate-600" />;
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold animate-pulse">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-3 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs h-7">
                            <Check className="h-3 w-3 mr-1" />
                            Mark all read
                        </Button>
                    )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 text-sm">
                            No notifications yet
                        </div>
                    ) : (
                        notifications.slice(0, 10).map(notification => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={cn(
                                    "flex items-start gap-3 p-3 cursor-pointer",
                                    !notification.read && "bg-blue-50/50"
                                )}
                            >
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={cn("text-sm", !notification.read && "font-medium")}>
                                        {notification.title}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate">{notification.body}</div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                    </div>
                                </div>
                                {!notification.read && (
                                    <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1"></div>
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
