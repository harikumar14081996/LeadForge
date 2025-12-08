import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white">
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold flex items-center gap-2">
                        LeadForge
                    </Link>
                    <Button variant="ghost" asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                <div className="prose prose-slate">
                    <p>Effective Date: December 6, 2024</p>
                    <p>
                        LeadForge (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information.
                    </p>
                    <h2>1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us when you apply for a loan, create an account, or communicate with us. This includes:
                    </p>
                    <ul>
                        <li>Personal identifiers (name, email, phone number, SIN)</li>
                        <li>Employment and financial information</li>
                        <li>Asset information (vehicle, home details)</li>
                        <li>Location data (IP address, geolocation for fraud prevention)</li>
                    </ul>
                    <h2>2. How We Use Your Information</h2>
                    <p>
                        We use your information to:
                    </p>
                    <ul>
                        <li>Process and evaluate your loan applications</li>
                        <li>Connect you with lenders or lead buyers</li>
                        <li>Communicate with you about services and updates</li>
                        <li>Prevent fraud and ensure security</li>
                    </ul>
                    <h2>3. Security</h2>
                    <p>
                        We implement robust security measures, including encryption of sensitive data like SIN, to protect your information. However, no internet transmission is completely secure.
                    </p>
                    <h2>4. Contact Us</h2>
                    <p>
                        If you have questions about this policy, please contact us.
                    </p>
                </div>
            </main>
            <footer className="border-t py-6 bg-gray-50 mt-12">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} LeadForge. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
