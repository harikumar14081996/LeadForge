"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string | null;
}

interface MentionInputProps {
    value: string;
    onChange: (value: string) => void;
    onMentionsChange: (userIds: string[]) => void;
    users: User[];
    placeholder?: string;
    onSubmit?: () => void;
}

export function MentionInput({
    value,
    onChange,
    onMentionsChange,
    users,
    placeholder,
    onSubmit,
}: MentionInputProps) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredUsers = users.filter(u =>
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(mentionQuery.toLowerCase())
    ).slice(0, 5);

    useEffect(() => {
        onMentionsChange(mentionedUsers);
    }, [mentionedUsers, onMentionsChange]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        // Check for @ trigger
        const lastAtIndex = newValue.lastIndexOf("@");
        if (lastAtIndex !== -1) {
            const textAfterAt = newValue.substring(lastAtIndex + 1);
            // Only show suggestions if no space after incomplete mention
            if (!textAfterAt.includes(" ") || textAfterAt.split(" ").length <= 2) {
                setMentionQuery(textAfterAt);
                setShowSuggestions(true);
                setSelectedIndex(0);
            } else {
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
        }
    };

    const selectUser = (user: User) => {
        const lastAtIndex = value.lastIndexOf("@");
        const beforeAt = value.substring(0, lastAtIndex);
        const mentionText = `@${user.first_name} ${user.last_name} `;

        onChange(beforeAt + mentionText);
        setMentionedUsers(prev => Array.from(new Set([...prev, user.id])));
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (showSuggestions && filteredUsers.length > 0) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredUsers.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredUsers.length) % filteredUsers.length);
            } else if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                selectUser(filteredUsers[selectedIndex]);
            } else if (e.key === "Escape") {
                setShowSuggestions(false);
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit?.();
        }
    };

    return (
        <div className="relative flex-1">
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full h-10 px-4 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Mention Suggestions */}
            {showSuggestions && filteredUsers.length > 0 && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50 animate-fade-in">
                    <div className="p-2 text-xs text-slate-500 border-b border-slate-100 font-medium">
                        Mention someone
                    </div>
                    {filteredUsers.map((user, index) => (
                        <button
                            key={user.id}
                            onClick={() => selectUser(user)}
                            className={cn(
                                "w-full flex items-center gap-3 p-2 text-left transition-colors",
                                index === selectedIndex ? "bg-blue-50" : "hover:bg-slate-50"
                            )}
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
        </div>
    );
}
