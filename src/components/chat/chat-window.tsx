"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Send, Smile } from "lucide-react";
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

    // Mark messages as read
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

            console.log("Subscribed to channel:", getConversationChannel(conversation.id));

            // New message handler
            channel.bind("new-message", (message: Message) => {
                console.log("Received new message:", message);
                setMessages(prev => [...prev, message]);
                markAsRead();
            });

            // Typing indicator handler
            channel.bind("typing", (data: { userId: string; userName: string; isTyping: boolean }) => {
                if (data.userId === session?.user?.id) return;

                setTypingUsers(prev => {
                    if (data.isTyping) {
                        if (!prev.find(u => u.userId === data.userId)) {
                            return [...prev, { userId: data.userId, userName: data.userName }];
                        }
                        return prev;
                    } else {
                        return prev.filter(u => u.userId !== data.userId);
                    }
                });

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
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + "px";
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

    const selectEveryoneMention = () => {
        const lastAtIndex = messageContent.lastIndexOf("@");
        const beforeAt = messageContent.substring(0, lastAtIndex);
        const mentionText = "@everyone ";

        setMessageContent(beforeAt + mentionText);
        // Add all conversation members (except self) to mentions
        const allMemberIds = conversation.members
            .filter(m => m.user.id !== session?.user?.id)
            .map(m => m.user.id);
        setMentionedUserIds(prev => Array.from(new Set([...prev, ...allMemberIds])));
        setShowMentions(false);
        textareaRef.current?.focus();
    };

    const filteredUsers = companyUsers.filter(u =>
        u.id !== session?.user?.id &&
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(mentionQuery.toLowerCase())
    ).slice(0, 5);

    // Check if @everyone should appear in suggestions
    const showEveryoneOption = conversation.is_group &&
        mentionQuery.toLowerCase().startsWith("every") ||
        mentionQuery === "";


    const sendMessage = async () => {
        if (!messageContent.trim() || sending) return;

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
                // Note: Message will appear via Pusher real-time event
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
        let content = message.content.replace(/\n/g, "<br>");

        // Highlight @everyone mentions
        content = content.replace(
            /@everyone/gi,
            '<span class="bg-amber-200/50 text-amber-700 px-1 rounded font-medium">@everyone</span>'
        );

        // Highlight individual mentions
        message.mentions.forEach(mention => {
            const mentionText = `@${mention.user.first_name} ${mention.user.last_name}`;
            content = content.replace(
                new RegExp(`@${mention.user.first_name}\\s*${mention.user.last_name}`, "gi"),
                `<span class="bg-blue-200/50 text-blue-700 px-1 rounded font-medium">${mentionText}</span>`
            );
        });

        return <span dangerouslySetInnerHTML={{ __html: content }} />;
    };

    const getTypingText = () => {
        if (typingUsers.length === 0) return null;
        if (typingUsers.length === 1) return `${typingUsers[0].userName} is typing`;
        if (typingUsers.length === 2) return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing`;
        return `${typingUsers.length} people are typing`;
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="h-8 w-8 rounded-full hover:bg-slate-100 transition-all"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 shadow-sm",
                    conversation.is_group
                        ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                        : "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                )}>
                    {conversation.is_group
                        ? conversation.name?.substring(0, 2).toUpperCase() || "GR"
                        : (() => {
                            const other = conversation.members.find(m => m.user.id !== session?.user?.id);
                            return other ? `${other.user.first_name[0]}${other.user.last_name[0]}` : "??";
                        })()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{getConversationName()}</div>
                    {conversation.is_group && (
                        <div className="text-xs text-slate-500">{conversation.members.length} members</div>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex gap-1">
                            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                            <Smile className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-sm">No messages yet</p>
                        <p className="text-slate-400 text-xs mt-1">Say hello! 👋</p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isMe = message.sender_id === session?.user?.id;
                        const showAvatar = !isMe && (index === 0 || messages[index - 1]?.sender_id !== message.sender_id);

                        return (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex animate-in slide-in-from-bottom-2 duration-200",
                                    isMe ? "justify-end" : "justify-start"
                                )}
                            >
                                {!isMe && (
                                    <div className="w-8 mr-2 flex-shrink-0">
                                        {showAvatar && (
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white text-xs font-medium shadow-sm">
                                                {message.sender.first_name[0]}{message.sender.last_name[0]}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className={cn(
                                    "max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm",
                                    isMe
                                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                                        : "bg-white border border-slate-200/80 text-slate-900 rounded-bl-md"
                                )}>
                                    {!isMe && conversation.is_group && showAvatar && (
                                        <div className="text-xs font-semibold text-blue-600 mb-1">
                                            {message.sender.first_name} {message.sender.last_name}
                                        </div>
                                    )}
                                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                        {renderMessageContent(message)}
                                    </div>
                                    <div className={cn(
                                        "text-[10px] mt-1.5 flex items-center gap-1",
                                        isMe ? "text-blue-100/80 justify-end" : "text-slate-400"
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
                <div className="px-4 py-2 flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-xs text-slate-500 italic">{getTypingText()}</span>
                </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-slate-200/80 bg-white/80 backdrop-blur-sm">
                {/* Mention Suggestions */}
                {showMentions && (filteredUsers.length > 0 || showEveryoneOption) && (
                    <div className="mb-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-2 duration-150">
                        <div className="px-3 py-2 text-xs text-slate-500 border-b border-slate-100 font-medium bg-slate-50">
                            💬 Mention someone
                        </div>
                        {/* @everyone option for group chats */}
                        {showEveryoneOption && conversation.is_group && (
                            <button
                                onClick={selectEveryoneMention}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-amber-50 transition-colors border-b border-slate-100"
                            >
                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                    @
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-900">
                                        @everyone
                                    </div>
                                    <div className="text-xs text-slate-500">Notify all {conversation.members.length} members</div>
                                </div>
                            </button>
                        )}
                        {filteredUsers.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => selectMention(user)}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-blue-50 transition-colors"
                            >
                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                                    {user.first_name[0]}{user.last_name[0]}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-900">
                                        {user.first_name} {user.last_name}
                                    </div>
                                </div>

                            </button>
                        ))}
                    </div>
                )}

                <div className="flex gap-2 items-end bg-slate-100 rounded-2xl p-1.5">
                    <textarea
                        ref={textareaRef}
                        value={messageContent}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        rows={1}
                        className="flex-1 resize-none bg-transparent px-3 py-2 text-sm focus:outline-none placeholder:text-slate-400 max-h-[100px]"
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={!messageContent.trim() || sending}
                        size="icon"
                        className={cn(
                            "h-9 w-9 rounded-xl transition-all duration-200",
                            messageContent.trim()
                                ? "bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-200"
                                : "bg-slate-300"
                        )}
                    >
                        <Send className={cn("h-4 w-4", sending && "animate-pulse")} />
                    </Button>
                </div>
                <div className="text-[10px] text-slate-400 text-center mt-1.5">
                    Press Enter to send • Shift+Enter for new line • @ to mention
                </div>
            </div>
        </div>
    );
}
