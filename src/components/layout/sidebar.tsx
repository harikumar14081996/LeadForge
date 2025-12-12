"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut, Settings, Briefcase, UserCircle, TrendingUp, Megaphone, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "ADMIN";

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "text-sky-500",
        },
        {
            label: "Leads",
            icon: Briefcase,
            href: "/dashboard/leads",
            color: "text-violet-500",
        },
        {
            label: "My Leads",
            icon: UserCircle,
            href: "/dashboard/my-leads",
            color: "text-pink-700",
        },
        ...(isAdmin ? [
            {
                label: "Loan Officers",
                icon: Users,
                href: "/users",
                color: "text-orange-700",
            },
            {
                label: "Company Insights",
                icon: TrendingUp,
                href: "/dashboard/reports",
                color: "text-green-600",
            },
            {
                label: "Reminders",
                icon: Megaphone,
                href: "/reminders",
                color: "text-amber-500",
            },
            {
                label: "Company Settings",
                icon: Settings,
                href: "/settings/company",
                color: "text-gray-500",
            }
        ] : [
            // Non-admin users get My Reminders
            {
                label: "My Reminders",
                icon: Clock,
                href: "/my-reminders",
                color: "text-blue-500",
            }
        ]),
        {
            label: "Profile",
            icon: Settings,
            href: "/settings/profile",
            color: "text-gray-500",
        },

    ];

    return (
        <div className={cn("space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white", className)}>
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <TrendingUp className="h-8 w-8 mr-4 text-blue-500" />
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold">
                            LeadForge
                        </h1>
                        {session?.user?.company_name && (
                            <span className="text-xs text-gray-400 font-medium">
                                {session.user.company_name}
                            </span>
                        )}
                    </div>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                {session?.user && (
                    <div className="mb-2 p-3 flex items-center bg-slate-800/50 rounded-xl border border-slate-800">
                        <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3 border-2 border-slate-700 shadow-sm shrink-0 overflow-hidden relative">
                            {session.user.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span>{session.user.name?.charAt(0).toUpperCase() || 'U'}</span>
                            )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-white truncate">
                                {session.user.name?.split(" ")[0]}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium truncate">
                                {session.user.role || 'User'}
                            </span>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400"
                >
                    <div className="flex items-center flex-1">
                        <LogOut className="h-5 w-5 mr-3 text-red-500" />
                        Logout
                    </div>
                </button>
            </div>
        </div>
    );
}
