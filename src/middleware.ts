import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Custom logic if needed, currently just basic auth check
        const token = req.nextauth.token;

        console.log(`Middleware: ${req.method} ${req.nextUrl.pathname}`);
        console.log(`Middleware: Token present? ${!!token}`, token ? `Role: ${token.role}` : "No token");

        // Example: Admin only routes
        if (req.nextUrl.pathname.startsWith("/users") || req.nextUrl.pathname.startsWith("/settings/company")) {
            if (token?.role !== "ADMIN") {
                console.log("Middleware: Redirecting non-admin from protected route");
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: async ({ token, req }) => {
                if (token) return true; // Automatic decoding worked

                // Fallback: Manual decoding
                const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-key-change-in-prod";

                // Explicitly decrypt the token to see if we can find it
                const manualToken = await getToken({
                    req,
                    secret,
                    // If cookie name is customized (e.g. __Secure- prefix handling), getToken usually handles it,
                    // but we can rely on standard behavior first.
                });

                console.log("Middleware: Auth Check", {
                    path: req.nextUrl.pathname,
                    autoTokenFound: !!token,
                    manualTokenFound: !!manualToken,
                    cookieNames: req.cookies.getAll().map(c => c.name),
                });

                return !!manualToken;
            },
        },
        pages: {
            signIn: "/login",
        },
        secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-change-in-prod",
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/users/:path*",
        "/settings/:path*",
        // Add other protected routes
    ],
};
