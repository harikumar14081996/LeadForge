"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, Plus, Users, X, Search, Bell, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatWindow } from "./chat-window";
import { cn } from "@/lib/utils";
import { getPusherClient } from "@/lib/pusher";
import { formatDistanceToNow } from "date-fns";

interface User {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    email: string;
}

interface ConversationMember {
    user: User;
}

interface LastMessage {
    content: string;
    created_at: string;
    sender: { first_name: string; last_name: string };
}

interface Conversation {
    id: string;
    name: string | null;
    is_group: boolean;
    members: ConversationMember[];
    lastMessage: LastMessage | null;
    hasUnread: boolean;
    updated_at: string;
}

interface Notification {
    id: string;
    type: string;
    title: string;
    body: string;
    read: boolean;
    created_at: string;
}

type TabType = "chats" | "notifications" | "new-chat" | "new-group";

export function ChatPanel() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [companyUsers, setCompanyUsers] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>("chats");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Group creation
    const [groupName, setGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const fetchConversations = useCallback(async () => {
        try {
            const res = await fetch("/api/chat/conversations");
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
            }
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch("/api/chat/users");
            if (res.ok) {
                const data = await res.json();
                setCompanyUsers(data.filter((u: User) => u.id !== session?.user?.id));
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    }, [session?.user?.id]);

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
        if (isOpen && session?.user?.id) {
            fetchConversations();
            fetchUsers();
            fetchNotifications();
        }
    }, [isOpen, session?.user?.id, fetchConversations, fetchUsers, fetchNotifications]);

    // Subscribe to real-time updates for new conversations and messages
    useEffect(() => {
        if (!session?.user?.id) return;

        const pusher = getPusherClient();
        if (pusher) {
            const channel = pusher.subscribe(`private-user-${session.user.id}`);

            // New conversation created
            channel.bind("new-conversation", () => {
                fetchConversations();
            });

            // New notification
            channel.bind("notification", () => {
                fetchNotifications();
            });

            return () => {
                channel.unbind_all();
                pusher.unsubscribe(`private-user-${session.user.id}`);
            };
        }
    }, [session?.user?.id, fetchConversations, fetchNotifications]);

    const startDM = async (userId: string) => {
        setLoading(true);
        try {
            const res = await fetch("/api/chat/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userIds: [userId], isGroup: false }),
            });
            if (res.ok) {
                const conversation = await res.json();
                setSelectedConversation(conversation);
                setActiveTab("chats");
                fetchConversations();
            }
        } catch (error) {
            console.error("Failed to start DM:", error);
        } finally {
            setLoading(false);
        }
    };

    const createGroup = async () => {
        if (!groupName.trim() || selectedMembers.length === 0) return;

        setLoading(true);
        try {
            const res = await fetch("/api/chat/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userIds: selectedMembers,
                    isGroup: true,
                    name: groupName.trim()
                }),
            });
            if (res.ok) {
                const conversation = await res.json();
                setSelectedConversation(conversation);
                setActiveTab("chats");
                setGroupName("");
                setSelectedMembers([]);
                fetchConversations();
            }
        } catch (error) {
            console.error("Failed to create group:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAllNotificationsRead = async () => {
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

    const toggleMember = (userId: string) => {
        setSelectedMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const getConversationName = (conv: Conversation) => {
        if (conv.is_group && conv.name) return conv.name;
        const otherMember = conv.members.find(m => m.user.id !== session?.user?.id);
        return otherMember ? `${otherMember.user.first_name} ${otherMember.user.last_name}` : "Chat";
    };

    const getInitials = (conv: Conversation) => {
        if (conv.is_group) return conv.name?.substring(0, 2).toUpperCase() || "GR";
        const otherMember = conv.members.find(m => m.user.id !== session?.user?.id);
        return otherMember
            ? `${otherMember.user.first_name[0]}${otherMember.user.last_name[0]}`.toUpperCase()
            : "??";
    };

    const filteredUsers = companyUsers.filter(u =>
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
                {unreadCount > 0 && !isOpen && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in">
                    {selectedConversation ? (
                        <ChatWindow
                            conversation={selectedConversation}
                            onBack={() => {
                                setSelectedConversation(null);
                                fetchConversations(); // Refresh list after leaving chat
                            }}
                            companyUsers={companyUsers}
                        />
                    ) : (
                        <div className="flex flex-col h-full">
                            {/* Header with Tabs */}
                            <div className="border-b border-slate-100">
                                <div className="flex items-center justify-between p-4 pb-0">
                                    <h3 className="font-bold text-slate-900 text-lg">Messages</h3>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setActiveTab("new-chat")}
                                            className="h-8 w-8"
                                            title="New Chat"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setActiveTab("new-group")}
                                            className="h-8 w-8"
                                            title="New Group"
                                        >
                                            <UserPlus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex px-4 pt-3">
                                    <button
                                        onClick={() => setActiveTab("chats")}
                                        className={cn(
                                            "flex-1 pb-3 text-sm font-medium border-b-2 transition-colors",
                                            activeTab === "chats"
                                                ? "border-blue-600 text-blue-600"
                                                : "border-transparent text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        <MessageSquare className="h-4 w-4 inline mr-1" />
                                        Chats
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("notifications")}
                                        className={cn(
                                            "flex-1 pb-3 text-sm font-medium border-b-2 transition-colors relative",
                                            activeTab === "notifications"
                                                ? "border-blue-600 text-blue-600"
                                                : "border-transparent text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        <Bell className="h-4 w-4 inline mr-1" />
                                        Notifications
                                        {unreadCount > 0 && (
                                            <span className="ml-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto">
                                {activeTab === "chats" && (
                                    conversations.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                            <Users className="h-12 w-12 text-slate-300 mb-3" />
                                            <p className="text-slate-500 text-sm">No conversations yet</p>
                                            <Button variant="link" onClick={() => setActiveTab("new-chat")} className="mt-2">
                                                Start a chat
                                            </Button>
                                        </div>
                                    ) : (
                                        conversations.map(conv => (
                                            <button
                                                key={conv.id}
                                                onClick={() => setSelectedConversation(conv)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50",
                                                    conv.hasUnread && "bg-blue-50/50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-10 w-10 rounded-full flex items-center justify-center font-medium text-sm shrink-0",
                                                    conv.is_group ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                                )}>
                                                    {getInitials(conv)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <span className={cn("font-medium text-slate-900 truncate", conv.hasUnread && "font-bold")}>
                                                            {getConversationName(conv)}
                                                        </span>
                                                        {conv.hasUnread && (
                                                            <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0"></span>
                                                        )}
                                                    </div>
                                                    {conv.lastMessage && (
                                                        <p className="text-xs text-slate-500 truncate">
                                                            {conv.lastMessage.sender.first_name}: {conv.lastMessage.content}
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        ))
                                    )
                                )}

                                {activeTab === "notifications" && (
                                    <div>
                                        {unreadCount > 0 && (
                                            <div className="p-3 border-b border-slate-100">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={markAllNotificationsRead}
                                                    className="w-full text-blue-600"
                                                >
                                                    <Check className="h-4 w-4 mr-1" />
                                                    Mark all as read
                                                </Button>
                                            </div>
                                        )}
                                        {notifications.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                                                <Bell className="h-12 w-12 text-slate-300 mb-3" />
                                                <p className="text-slate-500 text-sm">No notifications yet</p>
                                            </div>
                                        ) : (
                                            notifications.map(notif => (
                                                <div
                                                    key={notif.id}
                                                    className={cn(
                                                        "p-3 border-b border-slate-50",
                                                        !notif.read && "bg-blue-50/50"
                                                    )}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                            {notif.type === "MENTION" ? (
                                                                <span className="text-blue-600 font-bold">@</span>
                                                            ) : (
                                                                <MessageSquare className="h-4 w-4 text-blue-600" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className={cn("text-sm", !notif.read && "font-medium")}>
                                                                {notif.title}
                                                            </div>
                                                            <div className="text-xs text-slate-500 truncate">{notif.body}</div>
                                                            <div className="text-xs text-slate-400 mt-1">
                                                                {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {activeTab === "new-chat" && (
                                    <div>
                                        <div className="p-3">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <Input
                                                    placeholder="Search team members..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                        {filteredUsers.map(user => (
                                            <button
                                                key={user.id}
                                                onClick={() => startDM(user.id)}
                                                disabled={loading}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left"
                                            >
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-sm">
                                                    {user.first_name[0]}{user.last_name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{user.first_name} {user.last_name}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {activeTab === "new-group" && (
                                    <div>
                                        <div className="p-3 space-y-3 border-b border-slate-100">
                                            <Input
                                                placeholder="Group name..."
                                                value={groupName}
                                                onChange={(e) => setGroupName(e.target.value)}
                                            />
                                            <div className="text-xs text-slate-500">
                                                Select members ({selectedMembers.length} selected)
                                            </div>
                                        </div>
                                        {companyUsers.map(user => (
                                            <button
                                                key={user.id}
                                                onClick={() => toggleMember(user.id)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left",
                                                    selectedMembers.includes(user.id) && "bg-blue-50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-10 w-10 rounded-full flex items-center justify-center font-medium text-sm",
                                                    selectedMembers.includes(user.id) ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"
                                                )}>
                                                    {selectedMembers.includes(user.id) ? (
                                                        <Check className="h-5 w-5" />
                                                    ) : (
                                                        <>{user.first_name[0]}{user.last_name[0]}</>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{user.first_name} {user.last_name}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </div>
                                            </button>
                                        ))}
                                        {selectedMembers.length > 0 && groupName.trim() && (
                                            <div className="p-3 border-t border-slate-100">
                                                <Button
                                                    onClick={createGroup}
                                                    disabled={loading}
                                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <Users className="h-4 w-4 mr-2" />
                                                    Create Group ({selectedMembers.length + 1} members)
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
