"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MentionInput } from "./mention-input";
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

export function ChatWindow({ conversation, onBack, companyUsers }: ChatWindowProps) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [messageContent, setMessageContent] = useState("");
    const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        fetchMessages();

        // Subscribe to real-time updates
        const pusher = getPusherClient();
        if (pusher) {
            const channel = pusher.subscribe(getConversationChannel(conversation.id));
            channel.bind("new-message", (message: Message) => {
                setMessages(prev => [...prev, message]);
            });

            return () => {
                channel.unbind_all();
                pusher.unsubscribe(getConversationChannel(conversation.id));
            };
        }
    }, [conversation.id, fetchMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!messageContent.trim() || sending) return;

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

    const getConversationName = () => {
        if (conversation.is_group && conversation.name) return conversation.name;
        const otherMember = conversation.members.find(m => m.user.id !== session?.user?.id);
        return otherMember ? `${otherMember.user.first_name} ${otherMember.user.last_name}` : "Chat";
    };

    const renderMessageContent = (message: Message) => {
        let content = message.content;

        // Highlight mentions
        message.mentions.forEach(mention => {
            const mentionText = `@${mention.user.first_name} ${mention.user.last_name}`;
            content = content.replace(
                new RegExp(`@${mention.user.first_name}\\s*${mention.user.last_name}`, "gi"),
                `<span class="bg-blue-100 text-blue-700 px-1 rounded font-medium">${mentionText}</span>`
            );
        });

        return <span dangerouslySetInnerHTML={{ __html: content }} />;
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
                                    {!isMe && (
                                        <div className="text-xs font-medium text-blue-600 mb-1">
                                            {message.sender.first_name}
                                        </div>
                                    )}
                                    <div className="text-sm break-words">{renderMessageContent(message)}</div>
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

            {/* Input */}
            <div className="p-3 border-t border-slate-100 bg-white">
                <div className="flex gap-2">
                    <MentionInput
                        value={messageContent}
                        onChange={setMessageContent}
                        onMentionsChange={setMentionedUserIds}
                        users={companyUsers}
                        placeholder="Type a message... Use @ to mention"
                        onSubmit={sendMessage}
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={!messageContent.trim() || sending}
                        size="icon"
                        className="shrink-0 bg-blue-600 hover:bg-blue-700"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
