import { Sidebar } from "@/components/layout/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Assuming you might have this, if not, native simple
import { Menu } from "lucide-react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { NotificationBell } from "@/components/notifications/notification-bell";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-slate-900">
                <Sidebar />
            </div>
            <main className="md:pl-72 h-full bg-slate-50 min-h-screen">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white">
                    <div className="flex items-center">
                        <Sheet>
                            <SheetTrigger>
                                <Menu className="h-6 w-6" />
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 bg-slate-900">
                                <Sidebar />
                            </SheetContent>
                        </Sheet>
                        <span className="ml-4 font-bold text-lg">LeadForge</span>
                    </div>
                    <NotificationBell />
                </div>
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
            {/* Floating Chat Panel */}
            <ChatPanel />
        </div>
    );
}
