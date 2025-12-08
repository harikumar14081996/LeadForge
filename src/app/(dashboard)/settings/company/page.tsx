import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CompanySettingsForm } from "@/components/forms/CompanySettingsForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";

export default async function CompanySettingsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    if (session.user.role !== "ADMIN") {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    const company = await prisma.company.findUnique({
        where: { id: session.user.company_id },
    });

    if (!company) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Error</h1>
                <p>Company not found.</p>
            </div>
        );
    }

    const headersList = headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const shareLink = `${protocol}://${host}/apply?company=${company.id}`;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
                <p className="text-muted-foreground">Manage your organization details.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Shareable Application Link</CardTitle>
                    <CardDescription>
                        Share this link with your customers. Any applications submitted through this link will be automatically assigned to your company.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CopyButton value={shareLink} />
                </CardContent>
            </Card>

            <CompanySettingsForm
                initialData={{
                    ...company,
                    default_admin_fee_percent: company.default_admin_fee_percent ? Number(company.default_admin_fee_percent) : null
                }}
            />
        </div>
    );
}
