import { withAuth } from "next-auth/middleware";
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
            authorized: ({ token, req }) => {
                console.log("Middleware: Authorized Callback", {
                    path: req.nextUrl.pathname,
                    hasToken: !!token,
                    cookieNames: req.cookies.getAll().map(c => c.name),
                    isSecure: req.nextUrl.protocol === 'https:'
                });
                return !!token;
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
