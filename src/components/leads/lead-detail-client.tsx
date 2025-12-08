"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Need create or use standard
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LeadStatusSelector({ leadId, currentStatus }: { leadId: string, currentStatus: string }) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = async (val: string) => {
        setIsLoading(true);
        setStatus(val); // optimistic
        try {
            await fetch(`/api/leads/${leadId}`, {
                method: "PATCH",
                body: JSON.stringify({ status: val })
            });
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Select value={status} onValueChange={handleStatusChange} disabled={isLoading}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                <SelectItem value="ATTEMPTED_TO_CONTACT">Attempted to Contact</SelectItem>
                <SelectItem value="CONNECTED">Connected</SelectItem>
                <SelectItem value="QUALIFIED">Qualified</SelectItem>
                <SelectItem value="UNQUALIFIED">Unqualified</SelectItem>
                <SelectItem value="DECLINED">Declined</SelectItem>
                <SelectItem value="FUNDED">Funded</SelectItem>
            </SelectContent>
        </Select>
    );
}

export function LeadOwnerSelector({ leadId, currentOwnerId, users }: { leadId: string, currentOwnerId: string | null, users: { id: string, name: string }[] }) {
    const router = useRouter();
    const [ownerId, setOwnerId] = useState(currentOwnerId || "unassigned");
    const [isLoading, setIsLoading] = useState(false);

    const handleOwnerChange = async (val: string) => {
        setIsLoading(true);
        setOwnerId(val);
        try {
            await fetch(`/api/leads/${leadId}`, {
                method: "PATCH",
                body: JSON.stringify({ ownerId: val === "unassigned" ? null : val })
            });
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Select value={ownerId} onValueChange={handleOwnerChange} disabled={isLoading}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Assign Owner" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {users.map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function NotesSection({ leadId, notes: initialNotes }: { leadId: string, notes: any[] }) {
    const router = useRouter();
    const [notes, setNotes] = useState(initialNotes);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const addNote = async () => {
        if (!content.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/leads/${leadId}/notes`, {
                method: "POST",
                body: JSON.stringify({ content })
            });
            const data = await res.json();
            if (res.ok) {
                setNotes([data.note, ...notes]);
                setContent("");
                router.refresh();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Activity & Notes</h3>

            <div className="flex gap-2">
                <Textarea
                    placeholder="Add a note..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="flex-1 min-h-[80px]"
                />
                <Button onClick={addNote} disabled={loading || !content.trim()} className="h-auto">
                    {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                </Button>
            </div>

            <div className="space-y-4 mt-4 max-h-[500px] overflow-y-auto pr-2">
                {notes.map((note) => (
                    <div key={note.id} className="p-4 bg-white border rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">
                                {note.user?.first_name} {note.user?.last_name}
                            </span>
                            <span className="text-xs text-gray-500">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {format(new Date(note.created_at), "MMM d, h:mm a")}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                        {note.type !== 'GENERAL' && (
                            <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                                {note.type.replace("_", " ")}
                            </span>
                        )}
                    </div>
                ))}
                {notes.length === 0 && <p className="text-sm text-gray-500 text-center">No notes yet.</p>}
            </div>
        </div>
    );
}
