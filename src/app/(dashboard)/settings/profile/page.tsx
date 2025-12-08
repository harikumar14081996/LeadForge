import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProfileSettingsForm } from "@/components/forms/ProfileSettingsForm";

export default async function ProfileSettingsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Error</h1>
                <p>User not found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account and preferences.</p>
            </div>

            <ProfileSettingsForm initialData={{
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                avatarUrl: user.avatar_url
            }} />
        </div>
    );
}
