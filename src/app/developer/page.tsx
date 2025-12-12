"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function DeveloperPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900 selection:bg-black selection:text-white">
            {/* Header - Minimal */}
            <header className="px-6 h-20 flex items-center border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
                <div className="container mx-auto flex items-center justify-between">
                    <Button variant="ghost" className="gap-2 -ml-4 hover:bg-slate-50 text-slate-600 rounded-none h-12" asChild>
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                            Return
                        </Link>
                    </Button>
                    <div className="font-semibold tracking-tight">Harikumar Patel</div>
                    <div className="w-24"></div> {/* Spacer for balance */}
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section - Pure Minimalist */}
                <section className="py-32 md:py-48 border-b border-slate-100">
                    <div className="container px-6 mx-auto">
                        <div className="flex flex-col md:flex-row gap-16 items-start">
                            {/* Profile Image - Square */}
                            <div className="relative shrink-0 w-64 h-64 md:w-80 md:h-80 bg-slate-100">
                                <Image
                                    src="/profile.jpg"
                                    alt="Harikumar Patel"
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                    priority
                                />
                            </div>

                            <div className="flex-1 space-y-8">
                                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
                                    Architect.<br />
                                    Engineer.<br />
                                    Builder.
                                </h1>
                                <p className="text-xl md:text-2xl text-slate-500 max-w-2xl font-light leading-relaxed">
                                    Crafting digital ecosystems with a focus on precision, performance, and purpose.
                                    Currently building the future of lending software.
                                </p>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Button size="lg" className="h-14 px-10 bg-black hover:bg-slate-800 text-white rounded-none text-lg" asChild>
                                        <Link href="mailto:harikumar14081996@gmail.com">
                                            Contact Me
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="h-14 px-10 border-slate-200 hover:bg-slate-50 text-slate-900 rounded-none text-lg" asChild>
                                        <Link href="https://www.linkedin.com/in/harikumarpatel" target="_blank">
                                            LinkedIn
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* LeadForge Section */}
                <section className="py-32 border-b border-slate-100">
                    <div className="container px-6 mx-auto">
                        <div className="grid md:grid-cols-2 gap-24">
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Current Focus</h2>
                                <h3 className="text-4xl md:text-5xl font-bold mb-8">LeadForge</h3>
                                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                    A comprehensive CRM architected for high-velocity lending teams.
                                    Solving the industry&apos;s fragmentation problem through unified design and real-time data sync.
                                </p>
                                <ul className="space-y-4">
                                    {["Next.js 14 Architecture", "Real-time WebSocket Sync", "Bank-Grade Security", "Automated Financial Calcs"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-800 border-b border-slate-100 pb-4">
                                            <span className="w-1.5 h-1.5 bg-black"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-12 flex items-center justify-center">
                                {/* Abstract representation instead of phone/mockup */}
                                <div className="space-y-6 w-full max-w-sm">
                                    <div className="h-2 bg-slate-200 w-1/3"></div>
                                    <div className="h-2 bg-slate-200 w-2/3"></div>
                                    <div className="h-px bg-slate-200 w-full my-8"></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-32 bg-white border border-slate-200 p-4"></div>
                                        <div className="h-32 bg-white border border-slate-200 p-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Other Works - Grid */}
                <section className="py-32 border-b border-slate-100">
                    <div className="container px-6 mx-auto">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-16">Selected Works</h2>

                        <div className="grid md:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
                            {[
                                {
                                    title: "AI Chat",
                                    cat: "iOS Engineering",
                                    desc: "Local LLM integration with C++ and SwiftUI.",
                                    link: "#"
                                },
                                {
                                    title: "Momentum",
                                    cat: "Product Design",
                                    desc: "Habit tracking with haptic feedback.",
                                    link: "#"
                                },
                                {
                                    title: "Aura",
                                    cat: "Health Intelligence",
                                    desc: "Advanced metrics visualization.",
                                    link: "#"
                                }
                            ].map((project, i) => (
                                <div key={i} className="bg-white p-12 hover:bg-slate-50 transition-colors group h-full flex flex-col justify-between">
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">{project.cat}</div>
                                        <h3 className="text-2xl font-bold mb-4 group-hover:underline decoration-2 underline-offset-4">{project.title}</h3>
                                        <p className="text-slate-600 mb-8">{project.desc}</p>
                                    </div>
                                    <div className="flex justify-end">
                                        <ArrowLeft className="h-6 w-6 rotate-[135deg] text-slate-300 group-hover:text-black transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tech Stack - List */}
                <section className="py-32">
                    <div className="container px-6 mx-auto">
                        <div className="grid md:grid-cols-4 gap-12">
                            <div>
                                <h3 className="font-bold text-lg mb-6">Engineering</h3>
                                <ul className="space-y-2 text-slate-600">
                                    <li>TypeScript</li>
                                    <li>C++ / Swift</li>
                                    <li>Python</li>
                                    <li>PostgreSQL</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-6">Frameworks</h3>
                                <ul className="space-y-2 text-slate-600">
                                    <li>Next.js 14</li>
                                    <li>SwiftUI</li>
                                    <li>Node.js</li>
                                    <li>Tailwind CSS</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-6">Cloud</h3>
                                <ul className="space-y-2 text-slate-600">
                                    <li>Vercel</li>
                                    <li>AWS</li>
                                    <li>Docker</li>
                                    <li>CI/CD Pipelines</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-6">Design</h3>
                                <ul className="space-y-2 text-slate-600">
                                    <li>Figma Prototyping</li>
                                    <li>System Architecture</li>
                                    <li>UI/UX Strategy</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <footer className="bg-black text-white py-24">
                    <div className="container px-6 mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Available for new opportunities.</h2>
                        <Button size="lg" className="h-16 px-12 bg-white text-black hover:bg-slate-200 rounded-none text-xl font-bold" asChild>
                            <Link href="mailto:harikumar14081996@gmail.com">
                                Get in Touch
                            </Link>
                        </Button>
                        <div className="mt-16 flex justify-center gap-8 text-slate-500">
                            <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
                            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
                            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
