import { ApplicationWizard } from "@/components/forms/ApplicationWizard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ApplyPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const companyId = searchParams.company as string;
    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-8">
            <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Cancel & Return Home
                    </Link>
                </Button>
                <div className="text-right">
                    <h1 className="text-lg font-bold">Secure Application</h1>
                    <p className="text-xs text-gray-500">256-bit SSL Encrypted</p>
                </div>
            </div>

            <ApplicationWizard companyId={companyId} />
        </div>
    );
}
