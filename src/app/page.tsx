import Link from "next/link";
import { ArrowRight, Shield, TrendingUp, CheckCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center group" href="/">
          <div className="p-1.5 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="ml-2 text-xl font-bold tracking-tight text-slate-900">LeadForge</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-8 items-center">
          <Link className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden md:block" href="/developer">
            Meet Developer
          </Link>
          <Link className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden md:block" href="#features">
            Platform
          </Link>
          <Link className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden md:block" href="#for-companies">
            Why Us
          </Link>
          <div className="flex items-center gap-4 ml-4">
            <Link className="hidden sm:block text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors" href="/login">
              Login
            </Link>
            <Button asChild className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all hover:scale-105">
              <Link href="/login">
                Get Started
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-white relative overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10 animate-in fade-in duration-1000" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center max-w-5xl mx-auto">

              {/* Developer & Roadmap Banner */}
              <div className="flex flex-col sm:flex-row items-center gap-4 animate-in slide-in-from-bottom-4 duration-700">
                <Link href="/developer" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-blue-200 transition-all cursor-pointer">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  Meet the Architect: Harikumar Patel
                </Link>
                <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-800 shadow-sm">
                  🚀 Public Launch Coming 2026
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-slate-900 leading-[1.1] animate-in slide-in-from-bottom-8 duration-1000 delay-100">
                  Business Intelligence for <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Modern Lenders</span>
                </h1>
                <p className="mx-auto max-w-[800px] text-slate-600 md:text-xl leading-relaxed animate-in slide-in-from-bottom-12 duration-1000 delay-200">
                  Consolidate your leads, automate complex fee structures, and fast-track funding.
                  <br className="hidden sm:inline" />
                  <span className="font-semibold text-blue-600">New AI Sorting Engine (Beta)</span> helps you prioritize high-value clients instantly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 min-w-[300px] justify-center pt-6 animate-in slide-in-from-bottom-16 duration-1000 delay-300">
                <Button size="lg" asChild className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200/50 transition-all hover:-translate-y-1">
                  <Link href="/login">
                    Start Managing Leads
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-14 px-8 text-lg border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all">
                  <Link href="#features">
                    See Functionality
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full py-24 bg-slate-50 border-t border-slate-200">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">How LeadForge Helps You Limit Risk & Scale</h2>
              <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto">
                We replace chaotic spreadsheets with a structured, secure, and intelligent system designed for loan professionals.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="group flex flex-col space-y-4 p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300">
                <div className="p-4 w-fit bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors duration-300">
                  <TrendingUp className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Maximize Conversions</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Don&apos;t let good leads slip through the cracks. Our system tracks every interaction and prompts follow-ups to ensure you close every eligible deal.
                </p>
              </div>

              {/* Feature 2: Updated to AI Focus */}
              <div className="group flex flex-col space-y-4 p-8 bg-white border border-blue-50 ring-1 ring-blue-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">2026 PREVIEW</div>
                <div className="p-4 w-fit bg-purple-50 rounded-xl group-hover:bg-purple-600 transition-colors duration-300">
                  <Shield className="h-7 w-7 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">AI Lead Sorting</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Our upcoming neural engine analyzes borrower profiles to predict funding probability, letting your team focus on the top 20% of high-yield applications.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group flex flex-col space-y-4 p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-green-100/50 hover:-translate-y-1 transition-all duration-300">
                <div className="p-4 w-fit bg-green-50 rounded-xl group-hover:bg-green-600 transition-colors duration-300">
                  <CheckCircle className="h-7 w-7 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Automated Compliance</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Stop worrying about manual fee calculations. PPSR, Admin Fees, and document retention rules are enforced automatically on every file.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Audience Clarification */}
        <section id="for-companies" className="w-full py-24 bg-white border-t border-slate-200">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                  Built for Loan Companies,<br /><span className="text-slate-400">Not Borrowers.</span>
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  We understand the unique challenges of high-volume lending. You don&apos;t need another generic spreadsheet; you need a purpose-built CRM that speaks your language: &quot;Funded Volume&quot;, &quot;Admin Fees&quot;, and &quot;Conversion Rates&quot;.
                </p>
                <ul className="space-y-5 pt-4">
                  <li className="flex items-center gap-4 text-slate-700 text-lg">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">Centralized Lead Database</span>
                  </li>
                  <li className="flex items-center gap-4 text-slate-700 text-lg">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">Role-Based Access Control (Admin vs Agent)</span>
                  </li>
                  <li className="flex items-center gap-4 text-slate-700 text-lg">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">Bank-Grade Data Security (256-bit Encryption)</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 blur-[100px] opacity-20 rounded-full"></div>
                <div className="relative bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-2xl">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="font-semibold text-slate-900">Executive Report</div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Live Preview</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                        <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Total Funded</div>
                        <div className="text-2xl font-bold text-slate-900">$2,450,000</div>
                      </div>
                      <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Net Revenue</div>
                        <div className="text-2xl font-bold text-slate-900">$185,400</div>
                      </div>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between text-sm font-medium text-slate-600">
                        <span>Pipeline Goal</span>
                        <span>75% Achieved</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-900 w-[75%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Deep Dive Features */}
        <section className="w-full py-24 bg-white border-t border-slate-100">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Platform Capabilities</h2>
              <p className="mt-4 text-slate-600">Tailored workflows for every role in your organization.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Admin Side */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-900 rounded-xl">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">For Company Admins</h3>
                    <p className="text-slate-500 text-sm">Total control over your organization.</p>
                  </div>
                </div>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600">1</span>
                    <div>
                      <h4 className="font-semibold text-slate-900">Company Registration & Branding</h4>
                      <p className="text-slate-600 text-sm mt-1">Set up your agency profile instantly.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600">2</span>
                    <div>
                      <h4 className="font-semibold text-slate-900">Staff Management</h4>
                      <p className="text-slate-600 text-sm mt-1">Add Loan Officers, manage access, and activate/deactivate accounts with one click.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600">3</span>
                    <div>
                      <h4 className="font-semibold text-slate-900">Financial Control</h4>
                      <p className="text-slate-600 text-sm mt-1">Set global Admin Fees (e.g. 21%) and PPSR fees that auto-apply to every deal.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Loan Officer Side */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 rounded-xl">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">For Loan Officers</h3>
                    <p className="text-slate-500 text-sm">Tools to close deals faster.</p>
                  </div>
                </div>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-xs font-medium text-blue-600">1</span>
                    <div>
                      <h4 className="font-semibold text-slate-900">Smart Lead Entry</h4>
                      <p className="text-slate-600 text-sm mt-1">Manual entry wizard that validates data as you type.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-xs font-medium text-blue-600">2</span>
                    <div>
                      <h4 className="font-semibold text-slate-900">Status Tracking</h4>
                      <p className="text-slate-600 text-sm mt-1">Move leads through the pipeline: Connected &rarr; Qualified &rarr; Approved &rarr; Funded.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-xs font-medium text-blue-600">3</span>
                    <div>
                      <h4 className="font-semibold text-slate-900">Performance Stats</h4>
                      <p className="text-slate-600 text-sm mt-1">Real-time dashboard showing your funding volume and conversion metrics.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-slate-900 py-16 text-slate-400">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-600 rounded">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white text-xl">LeadForge</span>
            </div>
            <p className="text-base leading-relaxed">
              The trusted infrastructure for modern lending companies. We provide the tools; you provide the capital.
            </p>
            <div className="text-sm pt-2">
              © 2025 LeadForge Inc. <span className="text-slate-600 mx-2">|</span>
              <Link href="/developer" className="hover:text-white transition-colors">
                Developed by Harikumar Patel
              </Link>
            </div>
          </div>

          <nav className="flex flex-wrap gap-8">
            <Link className="text-sm font-medium hover:text-white transition-colors" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="text-sm font-medium hover:text-white transition-colors" href="#">
              Terms of Service
            </Link>
            <Link className="text-sm font-medium hover:text-white transition-colors" href="/login">
              Employee Login
            </Link>
            <Link className="text-sm font-medium hover:text-white transition-colors" href="mailto:support@leadforge.com">
              Contact Sales
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
