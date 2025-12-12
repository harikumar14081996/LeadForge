"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, Plus, Users, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatWindow } from "./chat-window";
import { cn } from "@/lib/utils";

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

export function ChatPanel() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [companyUsers, setCompanyUsers] = useState<User[]>([]);
    const [showNewChat, setShowNewChat] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        if (isOpen && session?.user?.id) {
            fetchConversations();
            fetchUsers();
        }
    }, [isOpen, session?.user?.id, fetchConversations, fetchUsers]);

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
                setShowNewChat(false);
                fetchConversations();
            }
        } catch (error) {
            console.error("Failed to start DM:", error);
        } finally {
            setLoading(false);
        }
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
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in">
                    {selectedConversation ? (
                        <ChatWindow
                            conversation={selectedConversation}
                            onBack={() => setSelectedConversation(null)}
                            companyUsers={companyUsers}
                        />
                    ) : showNewChat ? (
                        // New Chat View
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                                <h3 className="font-semibold text-slate-900">New Conversation</h3>
                                <Button variant="ghost" size="icon" onClick={() => setShowNewChat(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
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
                            <div className="flex-1 overflow-y-auto">
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
                        </div>
                    ) : (
                        // Conversations List
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-blue-600" />
                                    Messages
                                </h3>
                                <Button variant="ghost" size="icon" onClick={() => setShowNewChat(true)}>
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {conversations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                        <Users className="h-12 w-12 text-slate-300 mb-3" />
                                        <p className="text-slate-500 text-sm">No conversations yet</p>
                                        <Button variant="link" onClick={() => setShowNewChat(true)} className="mt-2">
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
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
