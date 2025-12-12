"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-slate-200/80",
                className
            )}
            {...props}
        />
    );
}

// Card skeleton for dashboard cards
export function CardSkeleton() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
        </div>
    );
}

// Table row skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
    return (
        <tr className="border-b border-slate-100">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="p-4">
                    <Skeleton className="h-4 w-full max-w-[120px]" />
                </td>
            ))}
        </tr>
    );
}

// Full page loading overlay
export function PageLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-slate-200"></div>
                    <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                </div>
                <p className="text-sm font-medium text-slate-600 animate-pulse">Loading...</p>
            </div>
        </div>
    );
}

// Pulsing dot loader
export function DotLoader() {
    return (
        <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce"></div>
        </div>
    );
}

// Dashboard skeleton layout
export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>

            {/* Table Skeleton */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="p-4 border-b border-slate-100">
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="p-4">
                    <table className="w-full">
                        <tbody>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <TableRowSkeleton key={i} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
