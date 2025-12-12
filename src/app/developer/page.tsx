"use client";

import { Mail, Linkedin, Github, ChevronRight, Code, Smartphone, Cloud, Palette, ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function DeveloperPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-blue-100">
            {/* Header */}
            <header className="px-4 lg:px-6 h-16 flex items-center bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100">
                <div className="container mx-auto flex items-center">
                    <Button variant="ghost" className="gap-2 -ml-4" asChild>
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                            Back to LeadForge
                        </Link>
                    </Button>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero - Developer Intro */}
                <section className="relative py-32 md:py-48 bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
                    {/* Animated Background Orbs */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />

                    <div className="container px-4 mx-auto relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                            {/* Photo */}
                            <div className="relative shrink-0">
                                <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden ring-4 ring-white/10 shadow-2xl">
                                    <Image
                                        src="/profile.jpg"
                                        alt="Harikumar Patel"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <div className="absolute -bottom-3 -right-3 bg-green-500 h-8 w-8 rounded-full ring-4 ring-slate-900 flex items-center justify-center">
                                    <span className="h-3 w-3 bg-white rounded-full animate-pulse" />
                                </div>
                            </div>

                            {/* Intro */}
                            <div className="text-center lg:text-left max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                                    Available for Hire
                                </div>

                                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                                    Harikumar Patel
                                </h1>

                                <p className="text-2xl md:text-3xl text-slate-300 font-light mb-8 leading-relaxed">
                                    Full Stack & iOS Engineer building
                                    <span className="text-blue-400 font-medium"> beautiful</span>,
                                    <span className="text-violet-400 font-medium"> performant</span> digital experiences.
                                </p>

                                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                    <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full font-semibold" asChild>
                                        <Link href="mailto:harikumar14081996@gmail.com">
                                            <Mail className="h-4 w-4 mr-2" />
                                            Contact Me
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/20 text-white hover:bg-white/10" asChild>
                                        <Link href="https://www.linkedin.com/in/harikumarpatel" target="_blank">
                                            <Linkedin className="h-4 w-4 mr-2" />
                                            LinkedIn
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About LeadForge - This Project */}
                <section className="py-24 md:py-32 bg-white">
                    <div className="container px-4 mx-auto">
                        <div className="max-w-4xl mx-auto text-center mb-16">
                            <div className="inline-flex items-center gap-2 mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                                LeadForge
                            </h2>
                            <p className="text-xl text-slate-500 leading-relaxed">
                                A production-ready Financial CRM built for Canadian lending companies.
                                Designed to solve data fragmentation, automate fee calculations, and deliver real-time reporting.
                            </p>
                        </div>

                        {/* Tech Stack Grid */}
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                {
                                    icon: Code,
                                    title: "Modern Stack",
                                    items: ["Next.js 14", "TypeScript", "Tailwind CSS", "PostgreSQL"]
                                },
                                {
                                    icon: Cloud,
                                    title: "Infrastructure",
                                    items: ["Vercel", "Prisma ORM", "Pusher (Real-time)", "NextAuth.js"]
                                },
                                {
                                    icon: Palette,
                                    title: "Features",
                                    items: ["Lead Management", "Team Chat", "Smart Reminders", "Analytics"]
                                }
                            ].map((stack, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow">
                                    <stack.icon className="h-10 w-10 text-blue-600 mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">{stack.title}</h3>
                                    <ul className="space-y-2">
                                        {stack.items.map((item, j) => (
                                            <li key={j} className="flex items-center gap-2 text-slate-600">
                                                <ChevronRight className="h-4 w-4 text-blue-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Skills - Minimal */}
                <section className="py-24 bg-slate-50 border-y border-slate-200">
                    <div className="container px-4 mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 text-center mb-16">What I Do</h2>

                        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                            {[
                                { icon: Code, title: "Full Stack", desc: "React, Next.js, Node.js, Python" },
                                { icon: Smartphone, title: "iOS", desc: "SwiftUI, Swift, CoreML" },
                                { icon: Cloud, title: "Cloud", desc: "Vercel, AWS, CI/CD" },
                                { icon: Palette, title: "Design", desc: "Figma, Tailwind, UI/UX" },
                            ].map((skill, i) => (
                                <div key={i} className="text-center">
                                    <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto mb-4">
                                        <skill.icon className="h-7 w-7 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 mb-1">{skill.title}</h3>
                                    <p className="text-sm text-slate-500">{skill.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Other Projects */}
                <section className="py-24 bg-white">
                    <div className="container px-4 mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 text-center mb-16">Other Works</h2>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                {
                                    title: "AI Chat (iOS)",
                                    desc: "On-device LLM chatbot using Gemma-2b with llama.cpp integration",
                                    tech: ["SwiftUI", "C++", "llama.cpp"],
                                    gradient: "from-violet-500 to-purple-600"
                                },
                                {
                                    title: "Momentum",
                                    desc: "Apple Design Award candidate habit tracking app with haptic feedback",
                                    tech: ["Swift", "SwiftData", "Haptics"],
                                    gradient: "from-emerald-500 to-green-600"
                                },
                                {
                                    title: "Aura 2.0",
                                    desc: "Health tracking ecosystem with custom ring animations and Swift Charts",
                                    tech: ["SwiftUI", "HealthKit", "Charts"],
                                    gradient: "from-rose-500 to-pink-600"
                                }
                            ].map((project, i) => (
                                <div key={i} className="group rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all">
                                    <div className={`h-32 bg-gradient-to-br ${project.gradient}`} />
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm mb-4">{project.desc}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tech.map((t, j) => (
                                                <span key={j} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-lg">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
                    <div className="container px-4 mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Let&apos;s Work Together</h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                            I&apos;m currently open to new opportunities. Let&apos;s build something amazing.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" className="h-14 px-10 bg-white text-blue-600 hover:bg-slate-100 rounded-full font-semibold" asChild>
                                <Link href="mailto:harikumar14081996@gmail.com">
                                    <Mail className="h-5 w-5 mr-2" />
                                    harikumar14081996@gmail.com
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/30 text-white hover:bg-white/10" asChild>
                                <Link href="https://www.linkedin.com/in/harikumarpatel" target="_blank">
                                    <Linkedin className="h-5 w-5 mr-2" />
                                    LinkedIn
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/30 text-white hover:bg-white/10" asChild>
                                <Link href="https://github.com/harikumar14081996" target="_blank">
                                    <Github className="h-5 w-5 mr-2" />
                                    GitHub
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-8 bg-slate-900 text-center">
                <p className="text-slate-500 text-sm">
                    © {new Date().getFullYear()} Harikumar Patel. Built with ❤️ in Canada 🇨🇦
                </p>
            </footer>
        </div>
    );
}
