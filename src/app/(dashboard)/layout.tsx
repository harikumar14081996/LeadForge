import { Sidebar } from "@/components/layout/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Assuming you might have this, if not, native simple
import { Menu } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>
            <main className="md:pl-72 h-full bg-gray-50 min-h-screen">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center p-4 bg-gray-900 text-white">
                    {/* Simple Mobile Menu Trigger - placeholder if Sheet component exists, otherwise standard nav */}
                    <Sheet>
                        <SheetTrigger>
                            <Menu className="h-6 w-6" />
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 bg-gray-900">
                            <Sidebar />
                        </SheetContent>
                    </Sheet>
                    <span className="ml-4 font-bold text-lg">LeadForge</span>
                </div>
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
