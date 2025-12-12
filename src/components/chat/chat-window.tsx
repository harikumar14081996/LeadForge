"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPusherClient, getConversationChannel } from "@/lib/pusher";
import { format } from "date-fns";

interface User {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    email: string;
}

interface Mention {
    user: { id: string; first_name: string; last_name: string };
}

interface Message {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    sender: { id: string; first_name: string; last_name: string; avatar_url: string | null };
    mentions: Mention[];
}

interface ConversationMember {
    user: User;
}

interface Conversation {
    id: string;
    name: string | null;
    is_group: boolean;
    members: ConversationMember[];
}

interface ChatWindowProps {
    conversation: Conversation;
    onBack: () => void;
    companyUsers: User[];
}

interface TypingUser {
    userId: string;
    userName: string;
}

export function ChatWindow({ conversation, onBack, companyUsers }: ChatWindowProps) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [messageContent, setMessageContent] = useState("");
    const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
    const [showMentions, setShowMentions] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch(`/api/chat/messages?conversationId=${conversation.id}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    }, [conversation.id]);

    // Mark messages as read when opening conversation
    const markAsRead = useCallback(async () => {
        try {
            await fetch("/api/chat/read", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId: conversation.id }),
            });
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    }, [conversation.id]);

    useEffect(() => {
        fetchMessages();
        markAsRead();

        // Subscribe to real-time updates
        const pusher = getPusherClient();
        if (pusher) {
            const channel = pusher.subscribe(getConversationChannel(conversation.id));

            // New message handler
            channel.bind("new-message", (message: Message) => {
                setMessages(prev => [...prev, message]);
                markAsRead(); // Mark new messages as read immediately
            });

            // Typing indicator handler
            channel.bind("typing", (data: { userId: string; userName: string; isTyping: boolean }) => {
                if (data.userId === session?.user?.id) return; // Ignore own typing

                setTypingUsers(prev => {
                    if (data.isTyping) {
                        // Add user if not already typing
                        if (!prev.find(u => u.userId === data.userId)) {
                            return [...prev, { userId: data.userId, userName: data.userName }];
                        }
                        return prev;
                    } else {
                        // Remove user from typing
                        return prev.filter(u => u.userId !== data.userId);
                    }
                });

                // Auto-remove after 3 seconds
                setTimeout(() => {
                    setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
                }, 3000);
            });

            return () => {
                channel.unbind_all();
                pusher.unsubscribe(getConversationChannel(conversation.id));
            };
        }
    }, [conversation.id, fetchMessages, markAsRead, session?.user?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
        }
    }, [messageContent]);

    // Send typing indicator
    const sendTypingIndicator = useCallback(async (isTyping: boolean) => {
        try {
            await fetch("/api/chat/typing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId: conversation.id, isTyping }),
            });
        } catch (error) {
            console.error("Failed to send typing indicator:", error);
        }
    }, [conversation.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setMessageContent(value);

        // Handle @mentions
        const lastAtIndex = value.lastIndexOf("@");
        if (lastAtIndex !== -1) {
            const textAfterAt = value.substring(lastAtIndex + 1);
            if (!textAfterAt.includes(" ") || textAfterAt.split(" ").length <= 2) {
                setMentionQuery(textAfterAt);
                setShowMentions(true);
            } else {
                setShowMentions(false);
            }
        } else {
            setShowMentions(false);
        }

        // Send typing indicator (debounced)
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        sendTypingIndicator(true);
        typingTimeoutRef.current = setTimeout(() => {
            sendTypingIndicator(false);
        }, 2000);
    };

    const selectMention = (user: User) => {
        const lastAtIndex = messageContent.lastIndexOf("@");
        const beforeAt = messageContent.substring(0, lastAtIndex);
        const mentionText = `@${user.first_name} ${user.last_name} `;

        setMessageContent(beforeAt + mentionText);
        setMentionedUserIds(prev => Array.from(new Set([...prev, user.id])));
        setShowMentions(false);
        textareaRef.current?.focus();
    };

    const filteredUsers = companyUsers.filter(u =>
        u.id !== session?.user?.id &&
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(mentionQuery.toLowerCase())
    ).slice(0, 5);

    const sendMessage = async () => {
        if (!messageContent.trim() || sending) return;

        // Stop typing indicator
        sendTypingIndicator(false);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        setSending(true);
        try {
            const res = await fetch("/api/chat/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conversationId: conversation.id,
                    content: messageContent,
                    mentionedUserIds,
                }),
            });

            if (res.ok) {
                setMessageContent("");
                setMentionedUserIds([]);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const getConversationName = () => {
        if (conversation.is_group && conversation.name) return conversation.name;
        const otherMember = conversation.members.find(m => m.user.id !== session?.user?.id);
        return otherMember ? `${otherMember.user.first_name} ${otherMember.user.last_name}` : "Chat";
    };

    const renderMessageContent = (message: Message) => {
        // Preserve line breaks and highlight mentions
        let content = message.content.replace(/\n/g, "<br>");

        message.mentions.forEach(mention => {
            const mentionText = `@${mention.user.first_name} ${mention.user.last_name}`;
            content = content.replace(
                new RegExp(`@${mention.user.first_name}\\s*${mention.user.last_name}`, "gi"),
                `<span class="bg-blue-100 text-blue-700 px-1 rounded font-medium">${mentionText}</span>`
            );
        });

        return <span dangerouslySetInnerHTML={{ __html: content }} />;
    };

    const getTypingText = () => {
        if (typingUsers.length === 0) return null;
        if (typingUsers.length === 1) return `${typingUsers[0].userName} is typing...`;
        if (typingUsers.length === 2) return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing...`;
        return `${typingUsers.length} people are typing...`;
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-slate-50">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center font-medium text-xs shrink-0",
                    conversation.is_group ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                )}>
                    {conversation.is_group
                        ? conversation.name?.substring(0, 2).toUpperCase() || "GR"
                        : (() => {
                            const other = conversation.members.find(m => m.user.id !== session?.user?.id);
                            return other ? `${other.user.first_name[0]}${other.user.last_name[0]}` : "??";
                        })()}
                </div>
                <div>
                    <div className="font-semibold text-slate-900 text-sm">{getConversationName()}</div>
                    {conversation.is_group && (
                        <div className="text-xs text-slate-500">{conversation.members.length} members</div>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                        No messages yet. Say hello! 👋
                    </div>
                ) : (
                    messages.map((message) => {
                        const isMe = message.sender_id === session?.user?.id;
                        return (
                            <div key={message.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                <div className={cn(
                                    "max-w-[80%] rounded-2xl px-4 py-2",
                                    isMe
                                        ? "bg-blue-600 text-white rounded-br-sm"
                                        : "bg-slate-100 text-slate-900 rounded-bl-sm"
                                )}>
                                    {!isMe && conversation.is_group && (
                                        <div className="text-xs font-medium text-blue-600 mb-1">
                                            {message.sender.first_name} {message.sender.last_name}
                                        </div>
                                    )}
                                    <div className="text-sm break-words whitespace-pre-wrap">{renderMessageContent(message)}</div>
                                    <div className={cn(
                                        "text-xs mt-1",
                                        isMe ? "text-blue-200" : "text-slate-400"
                                    )}>
                                        {format(new Date(message.created_at), "h:mm a")}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
                <div className="px-4 py-2 text-xs text-slate-500 italic animate-pulse">
                    {getTypingText()}
                </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-slate-100 bg-white relative">
                {/* Mention Suggestions */}
                {showMentions && filteredUsers.length > 0 && (
                    <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50">
                        <div className="p-2 text-xs text-slate-500 border-b border-slate-100 font-medium">
                            Mention someone
                        </div>
                        {filteredUsers.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => selectMention(user)}
                                className="w-full flex items-center gap-3 p-2 text-left hover:bg-slate-50 transition-colors"
                            >
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-medium">
                                    {user.first_name[0]}{user.last_name[0]}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-900">
                                        {user.first_name} {user.last_name}
                                    </div>
                                    <div className="text-xs text-slate-500">{user.email}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex gap-2 items-end">
                    <textarea
                        ref={textareaRef}
                        value={messageContent}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message... (Shift+Enter for new line, @ to mention)"
                        rows={1}
                        className="flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-[120px]"
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={!messageContent.trim() || sending}
                        size="icon"
                        className="shrink-0 bg-blue-600 hover:bg-blue-700 h-10 w-10"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
