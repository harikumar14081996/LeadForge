import { ApplicationWizard } from "@/components/forms/ApplicationWizard";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

export default async function ApplyPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const companyId = searchParams.company as string;
    let companyName = "LeadForge";

    if (companyId) {
        const company = await prisma.company.findUnique({
            where: { id: companyId },
            select: { name: true }
        });
        if (company) {
            companyName = company.name;
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-slate-900 text-white py-6 shadow-md">
                <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <ShieldCheck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Secure Application Portal</h1>
                            <p className="text-sm text-slate-400">Applying to <span className="text-white font-semibold">{companyName}</span></p>
                        </div>
                    </div>
                    <Button variant="ghost" asChild className="text-slate-400 hover:text-white hover:bg-slate-800">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Cancel Application
                        </Link>
                    </Button>
                </div>
            </header>

            <main className="py-10 px-4 md:px-8">
                <div className="max-w-3xl mx-auto mb-6 text-center">
                    <p className="text-sm text-slate-500 bg-white inline-block px-4 py-1 rounded-full shadow-sm border border-slate-200">
                        <span className="text-green-600 font-bold">✓</span> 256-bit SSL Encrypted Connection
                    </p>
                </div>
                <ApplicationWizard companyId={companyId} />
            </main>
        </div>
    );
}
