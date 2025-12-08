import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter"; // Removed unused
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("Authorize called with:", { email: credentials?.email });
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                    include: {
                        company: true
                    }
                });

                if (!user || !user.password_hash) {
                    console.log("User not found or no password hash");
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password_hash
                );

                console.log("Password valid:", isPasswordValid);

                if (!isPasswordValid) {
                    return null;
                }

                if (!user.is_active) {
                    console.log("User inactive");
                    throw new Error("User account is inactive");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: `${user.first_name} ${user.last_name}`,
                    role: user.role,
                    company_id: user.company_id,
                    company_name: user.company.name
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.company_id = user.company_id;
                token.company_name = user.company_name!;
            }
            return token;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async session({ session, token, trigger }) {
            if (token) {
                session.user.id = token.id as string;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                session.user.role = token.role as any;
                session.user.company_id = token.company_id as string;
                session.user.company_name = token.company_name as string;
            }
            return session;
        },
    },
};
