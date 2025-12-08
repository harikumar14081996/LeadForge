"use client";

import { Mail, Linkedin, Globe, Layout, Database, Shield, Cpu, Activity, CheckCircle, ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DeveloperPage() {
    // Other projects to show in the portfolio section
    const otherProjects = [
        {
            title: "AI Chat (iOS)",
            role: "iOS Engineer",
            description: "Production-ready iOS chatbot utilizing local LLMs (Gemma-2b). Integrated llama.cpp for on-device inference with a SwiftUI interface.",
            tech: ["SwiftUI", "C++", "llama.cpp", "CoreML"],
            icon: Cpu,
            color: "purple"
        },
        {
            title: "Momentum",
            role: "Product Developer",
            description: "An Apple Design Award candidate habit tracking app. Focused on minimal UI, haptic feedback, and efficient state management for daily routines.",
            tech: ["Swift", "SwiftData", "Apple Health", "Haptics"],
            icon: CheckCircle,
            color: "emerald"
        },
        {
            title: "Aura 2.0",
            role: "Mobile Developer",
            description: "Advanced health tracking ecosystem featuring custom ring animations, calorie tracking, and deep integration with Apple ecosystem sensors.",
            tech: ["SwiftUI", "HealthKit", "Animations", "Swift Charts"],
            icon: Activity,
            color: "rose"
        }
    ];

    const skills = [
        { category: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "SwiftUI"] },
        { category: "Backend", items: ["Node.js", "PostgreSQL", "Prisma ORM", "NextAuth.js", "REST APIs"] },
        { category: "AI & ML", items: ["Local LLMs", "llama.cpp Integration", "Prompt Engineering", "MCP Servers"] },
        { category: "DevOps", items: ["Vercel", "CI/CD", "Git", "Security Architecture"] },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Navigation Bar */}
            <header className="px-4 lg:px-6 h-16 flex items-center border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto flex items-center">
                    <Button variant="ghost" className="gap-2 -ml-4" asChild>
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </header>

            <main className="flex-1">

                {/* SECTION 1: ABOUT THIS PROJECT (LEADFORGE) */}
                <section className="py-16 md:py-24 bg-slate-900 text-white overflow-hidden relative">
                    {/* Background effects */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

                    <div className="container px-4 mx-auto relative z-10">
                        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
                            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-4 inline-block">
                                <TrendingUp className="h-12 w-12 text-blue-400" />
                            </div>

                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                                About <span className="text-blue-400">LeadForge</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
                                A next-generation Financial CRM architected to solve the lending industry&apos;s biggest challenges: <span className="text-white font-medium">Data Fragmentation</span>, <span className="text-white font-medium">Fee Calculation Errors</span>, and <span className="text-white font-medium">Reporting Latency</span>.
                            </p>

                            <div className="grid md:grid-cols-3 gap-6 w-full text-left mt-12">
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
                                    <Database className="h-8 w-8 text-emerald-400 mb-4" />
                                    <h3 className="font-bold text-lg mb-2">Data Integrity</h3>
                                    <p className="text-slate-400 text-sm">Powered by <strong>PostgreSQL</strong> and <strong>Prisma</strong> to ensure strict relational data consistency across thousands of leads.</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
                                    <Shield className="h-8 w-8 text-blue-400 mb-4" />
                                    <h3 className="font-bold text-lg mb-2">Secure Architecture</h3>
                                    <p className="text-slate-400 text-sm">Bank-level security with Role-Based Access Control (RBAC) ensuring Officer and Admin data segregation.</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
                                    <Layout className="h-8 w-8 text-purple-400 mb-4" />
                                    <h3 className="font-bold text-lg mb-2">Modern UX</h3>
                                    <p className="text-slate-400 text-sm">Built with <strong>Next.js 14</strong> and <strong>Tailwind CSS</strong> for an instant, app-like experience with zero loading states.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: THE DEVELOPER */}
                <section className="py-20 md:py-32 bg-white">
                    <div className="container px-4 mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Profile Image Column */}
                            <div className="order-2 lg:order-1 flex justify-center lg:justify-end">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-600 rounded-[2rem] rotate-6 opacity-10"></div>
                                    <div className="w-80 h-[28rem] md:w-96 md:h-[32rem] relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                                        <Image
                                            src="/profile.jpg"
                                            alt="Harikumar Patel"
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3">
                                        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="font-bold text-slate-900 text-sm">Open to Work</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bio Column */}
                            <div className="order-1 lg:order-2 space-y-8">
                                <div>
                                    <h4 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2">The Architect</h4>
                                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Harikumar Patel</h2>
                                    <p className="text-xl text-slate-600 leading-relaxed">
                                        I am a <strong>Full Stack & iOS Engineer</strong> obsessed with performance and design.
                                        I don&apos;t just write code; I build complete digital ecosystems.
                                    </p>
                                    <p className="text-lg text-slate-500 leading-relaxed mt-4">
                                        With expertise spanning from low-level C++ AI integration to high-level React architecture,
                                        I bridge the gap between complex backend logic and beautiful, human-centric interfaces.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="font-bold text-slate-900 text-xl">Technical Arsenal</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {skills.map((skillGroup, idx) => (
                                            <div key={idx} className="border-l-2 border-blue-200 pl-4">
                                                <h4 className="font-semibold text-slate-800 text-sm mb-1">{skillGroup.category}</h4>
                                                <p className="text-sm text-slate-500">{skillGroup.items.slice(0, 3).join(", ")}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Button className="h-12 px-8 bg-slate-900 text-white hover:bg-slate-800 rounded-full" asChild>
                                        <Link href="mailto:contact@example.com">
                                            <Mail className="h-4 w-4 mr-2" />
                                            Contact Me
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="h-12 px-8 rounded-full" asChild>
                                        <Link href="#">
                                            <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                                            LinkedIn
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="h-12 px-8 rounded-full" asChild>
                                        <Link href="#">
                                            <Globe className="h-4 w-4 mr-2 text-slate-700" />
                                            Portfolio
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: OTHER WORKS */}
                <section className="py-20 bg-slate-50 border-t border-slate-200">
                    <div className="container px-4 mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Other Featured Works</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {otherProjects.map((project, index) => (
                                <div key={index} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col">
                                    <div className="p-6 flex-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-2 rounded-lg bg-${project.color}-50 text-${project.color}-600`}>
                                                <project.icon className="h-6 w-6" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {project.tech.slice(0, 3).map((t, i) => (
                                                <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 text-xs font-normal">
                                                    {t}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 4: CONTACT FOOTER */}
                <footer className="bg-white py-12 border-t border-slate-200 text-center">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Let&apos;s Connect</h2>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-slate-600">
                            <a href="mailto:contact@example.com" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                <Mail className="h-5 w-5" />
                                <span>contact@example.com</span>
                            </a>
                            <a href="https://www.linkedin.com/in/harikumarpatel" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span>linkedin.com/in/harikumarpatel</span>
                            </a>
                        </div>
                        <p className="text-slate-400 text-sm mt-8">
                            © {new Date().getFullYear()} Harikumar Patel. All rights reserved.
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
