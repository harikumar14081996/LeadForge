import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { AddUserDialog } from "@/components/users/add-user-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserActions } from "@/components/users/user-actions";

export default async function UsersPage() {
    const session = await getServerSession(authOptions);
    if (!session) return redirect("/login");
    if (session.user.role !== "ADMIN") return notFound(); // Only admins

    const users = await prisma.user.findMany({
        where: { company_id: session.user.company_id },
        orderBy: { created_at: "desc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Loan Officer Management</h1>
                    <p className="text-muted-foreground">Manage loan officers and roles for your organization.</p>
                </div>
                <AddUserDialog />
            </div>

            <div className="border rounded-lg bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(user.created_at), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Badge variant={user.is_active ? "default" : "destructive"}>
                                            {user.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                        <UserActions user={user} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
