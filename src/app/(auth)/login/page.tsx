"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (res?.error) {
                if (res.error === "CredentialsSignin") {
                    setError("Invalid email or password. Please try again.");
                } else if (res.error.includes("AccountDeactivated")) {
                    setError("This account has been deactivated. Contact your administrator.");
                } else {
                    setError("Authentication failed. " + res.error);
                }
            } else {
                router.push("/dashboard");
                router.refresh();
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Login Error:", error);
            setError("An unexpected system error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-screen lg:grid lg:grid-cols-2">
            {/* Left Panel - Branding & Information */}
            <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-12 text-white relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <AlertCircle className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">LeadForge</span>
                    </div>

                    <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                        Unified Access <br />
                        <span className="text-blue-400">Portal</span>
                    </h1>
                    <p className="text-slate-400 text-xl max-w-md leading-relaxed">
                        One secure login for your entire organization. streamlined access for all roles.
                    </p>
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                            <AlertCircle className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Company Admins</h3>
                            <p className="text-slate-500">Manage fees, users, and organization settings.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                            <Mail className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Loan Officers</h3>
                            <p className="text-slate-500">Track leads, monitor status, and view performance.</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-slate-500">
                    © {new Date().getFullYear()} LeadForge Inc. All rights reserved. • <span className="text-slate-600">Secure 256-bit Connection</span>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-8 bg-slate-50">
                <div className="mx-auto grid w-full max-w-md gap-6">
                    <div className="absolute top-4 left-4 lg:hidden">
                        <Button variant="ghost" asChild className="gap-2 text-slate-600">
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                    </div>
                    {/* Desktop Back Button (inside the flex container but positioned absolute or properly flowed) */}
                    <div className="hidden lg:block absolute top-8 left-8 z-20">
                        {/* Intentionally left blank or can be added if design requires, but split screen usually implies staying put. 
                               Actually, user asked for back button on login page. Let's put it on top of the right panel form area.
                           */}
                    </div>
                    <div className="w-full flex justify-start mb-4 lg:mb-0">
                        <Button variant="ghost" asChild className="gap-2 text-slate-500 hover:text-slate-900 -ml-4 mb-4">
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>

                    <div className="text-center mb-6">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
                        <p className="text-slate-500 mt-2">Enter your credentials to access the Unified Dashboard</p>
                    </div>

                    <Card className="border-slate-200 shadow-xl">
                        <CardHeader className="space-y-1 pb-2">
                            <div className="flex items-center justify-center gap-2 text-sm text-blue-600 font-medium bg-blue-50 py-2 rounded-lg mb-2">
                                <Lock className="h-4 w-4" />
                                Secure Login System
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Work Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@company.com"
                                            className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                            {...register("email")}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm text-blue-600 hover:underline font-medium"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                            {...register("password")}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-500">{errors.password.message}</p>
                                    )}
                                </div>

                                {error && (
                                    <div className="flex items-start space-x-2 text-red-600 bg-red-50 p-3 rounded-md text-sm border border-red-100 animate-in fade-in slide-in-from-top-1">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                        <span className="font-medium leading-relaxed">{error}</span>
                                    </div>
                                )}

                                <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-200/50" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Sign In to Dashboard
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center border-t border-slate-100 pt-6 mt-2">
                            <p className="text-sm text-slate-500">
                                Need to register your company?{" "}
                                <Link href="/signup" className="text-blue-600 font-bold hover:underline">
                                    Get Started
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
