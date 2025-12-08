
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ApplicationWizard } from "@/components/forms/ApplicationWizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewLeadPage() {
    const session = await getServerSession(authOptions);
    if (!session) return redirect("/login");

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Lead Application</h1>
                <p className="text-muted-foreground">Submit a new application internally. You will be assigned as the owner.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Application Form</CardTitle>
                </CardHeader>
                <CardContent>
                    <ApplicationWizard isInternal={true} userId={session.user.id} />
                </CardContent>
            </Card>
        </div>
    );
}
