import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md space-y-8 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
                    <FileQuestion className="h-12 w-12 text-blue-600" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                    404
                </h1>
                <p className="text-lg text-slate-600">
                    Page not found. The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <div className="pt-4">
                    <Button asChild className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 rounded-full">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
