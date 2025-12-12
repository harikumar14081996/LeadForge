import Link from "next/link";
import { ArrowRight, TrendingUp, CheckCircle, Menu, Users, MessageSquare, Bell, Mail, BarChart3, Clock, Zap, Star, ChevronRight, FileText, MapPin, Lock, CreditCard, UserCheck, RefreshCw, Settings, Send, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans selection:bg-blue-100">
      {/* Header - Clean White */}
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200 shadow-sm">
        <Link className="flex items-center justify-center group" href="/">
          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg group-hover:scale-105 transition-transform">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="ml-2 text-xl font-bold text-slate-900">LeadForge</span>
        </Link>

        <nav className="ml-auto flex gap-6 items-center">
          <Link className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden md:block" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden md:block" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden md:block" href="/developer">
            Developer
          </Link>
          <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-200">
            <Link href="/login">
              Get Started
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="#features">Features</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#pricing">Pricing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/developer">Developer</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>

      <main className="flex-1">
        {/* HERO SECTION - Warm & Inviting */}
        <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-white via-emerald-50/30 to-indigo-50/50 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-full blur-3xl" />

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-lg border border-blue-100">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm font-medium text-slate-700">Now with Team Chat, Reminders & Professional Signatures</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Close More Loans.
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 text-transparent bg-clip-text">
                  Grow Your Business.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl leading-relaxed">
                The all-in-one platform built specifically for
                <span className="font-semibold text-blue-600"> loan officers </span>
                and <span className="font-semibold text-indigo-600">lending companies.</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button size="lg" asChild className="h-14 px-10 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl shadow-blue-200/50 rounded-full font-semibold">
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-14 px-10 text-lg border-slate-300 text-slate-700 hover:bg-slate-50 rounded-full">
                  <Link href="#features">
                    Explore Features
                  </Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center items-center gap-8 pt-12 text-slate-500 text-sm">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-500" />
                  <span>Bank-Grade Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-indigo-500" />
                  <span>Real-time Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>Canadian Built</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ALL FEATURES SHOWCASE */}
        <section id="features" className="py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">Everything You Need</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Powerful Features for Modern Lenders
              </h3>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                From lead capture to funding — we&apos;ve got every step covered.
              </p>
            </div>

            {/* Feature Grid - All Small Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { icon: Users, title: "360° Lead Profiles", desc: "Complete applicant info in one place", color: "emerald" },
                { icon: MapPin, title: "Geolocation Capture", desc: "Track where applications come from", color: "teal" },
                { icon: Lock, title: "SIN Encryption", desc: "Bank-grade security for sensitive data", color: "blue" },
                { icon: FileText, title: "Document Notes", desc: "Add notes to track conversations", color: "purple" },
                { icon: TrendingUp, title: "Pipeline Management", desc: "Visual status tracking", color: "emerald" },
                { icon: CreditCard, title: "Auto Fee Calculation", desc: "PPSR, admin, dealer fees", color: "teal" },
                { icon: UserCheck, title: "Lead Assignment", desc: "Assign leads to loan officers", color: "blue" },
                { icon: RefreshCw, title: "Resubmission Tracking", desc: "Know if client reapplied", color: "purple" },
              ].map((feature, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 hover:border-slate-200 transition-all duration-300">
                  <div className={`h-12 w-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURE: Team Chat */}
        <section className="py-24 bg-gradient-to-br from-emerald-50 via-indigo-50/30 to-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  <MessageSquare className="h-4 w-4" />
                  Built-in Team Chat
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                  Stay connected
                  <span className="text-blue-600"> without switching apps.</span>
                </h3>

                <p className="text-xl text-slate-600 leading-relaxed">
                  Real-time messaging built right into your workflow. Discuss leads, share updates, and coordinate with your team.
                </p>

                <div className="space-y-4 pt-4">
                  {[
                    { icon: MessageSquare, title: "1:1 & Group Chats", desc: "Private DMs or team channels" },
                    { icon: Users, title: "@Mention Teammates", desc: "Get attention when it matters" },
                    { icon: Bell, title: "Instant Notifications", desc: "Never miss an important message" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm border border-blue-100">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{item.title}</div>
                        <div className="text-sm text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Mockup */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200/50 to-indigo-200/50 blur-3xl rounded-full" />
                <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-sm text-white">LT</div>
                    <div>
                      <div className="font-semibold text-slate-900">Lending Team</div>
                      <div className="text-xs text-slate-500">Sarah, Mike, Lisa</div>
                    </div>
                    <div className="ml-auto">
                      <span className="h-2 w-2 rounded-full bg-blue-500 inline-block animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-violet-500 flex items-center justify-center text-xs font-bold text-white shrink-0">SM</div>
                      <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                        <div className="text-xs text-violet-600 font-medium">Sarah M.</div>
                        <div className="text-sm text-slate-700">Anderson file is funded! 🎉</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">MK</div>
                      <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                        <div className="text-xs text-blue-600 font-medium">Mike K.</div>
                        <div className="text-sm text-slate-700"><span className="bg-blue-100 text-blue-700 px-1 rounded">@Sarah</span> Amazing! $45K this week! 💪</div>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                        <div className="text-sm text-white">Team meeting at 3pm <span className="bg-white/20 px-1 rounded">@everyone</span></div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0">You</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE: Reminders & Announcements */}
        <section className="py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Mockup */}
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-200/50 to-orange-200/50 blur-3xl rounded-full" />
                <div className="relative space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                        <Bell className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-amber-600 uppercase">Company Announcement</div>
                        <div className="font-semibold text-slate-900 mt-1">End-of-Month Pipeline Review</div>
                        <div className="text-sm text-slate-600 mt-1">Submit your forecasts by Friday EOD.</div>
                        <div className="flex gap-2 mt-3">
                          <button className="px-4 py-1.5 rounded-full bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition">Mark Done</button>
                          <button className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm hover:bg-slate-200 transition">Snooze</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-blue-600 uppercase">Personal Reminder</span>
                          <span className="text-xs text-slate-500">Daily @ 9:00 AM</span>
                        </div>
                        <div className="font-semibold text-slate-900 mt-1">Follow up on pending docs</div>
                        <div className="text-sm text-slate-600 mt-1">Check for missing client documents.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                  <Bell className="h-4 w-4" />
                  Smart Reminders
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                  Never miss a
                  <span className="text-amber-500"> follow-up.</span>
                </h3>

                <p className="text-xl text-slate-600 leading-relaxed">
                  Admins broadcast company-wide announcements. Loan officers set personal reminders. Notifications pop up right on schedule.
                </p>

                <div className="space-y-3 pt-4">
                  {[
                    { title: "Company Announcements", desc: "Broadcast to entire team with acknowledgment" },
                    { title: "Personal Reminders", desc: "Daily, weekly, specific day scheduling" },
                    { title: "Popup Notifications", desc: "Real-time alerts that come to you" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-amber-500 shrink-0" />
                      <span className="text-slate-700"><span className="font-medium">{item.title}</span> — {item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE: Email with Signature */}
        <section className="py-24 bg-gradient-to-br from-indigo-50 via-cyan-50/30 to-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  One-Click Email
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                  Contact leads
                  <span className="text-indigo-600"> in seconds.</span>
                </h3>

                <p className="text-xl text-slate-600 leading-relaxed">
                  Click &quot;Send Email&quot; on any lead. Your email opens prefilled with templates and your professional signature.
                </p>

                <div className="space-y-3 pt-4">
                  {[
                    { title: "Template Placeholders", desc: "{name} & {loan_type} auto-filled" },
                    { title: "Professional Signature", desc: "Name, title, phone, email appended" },
                    { title: "Any Email Provider", desc: "Gmail, Outlook, Yahoo, iCloud, ProtonMail" },
                    { title: "One-Click from Lead List", desc: "Email icon right in My Leads table" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-indigo-500 shrink-0" />
                      <span className="text-slate-700"><span className="font-medium">{item.title}</span> — {item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email Mockup */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/50 to-cyan-200/50 blur-3xl rounded-full" />
                <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6">
                  <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <span className="font-medium text-slate-700">To:</span>
                      <span>john.anderson@email.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-medium text-slate-700">Subject:</span>
                      <span>Regarding Your Personal Loan Application</span>
                    </div>
                  </div>

                  <div className="p-4 text-slate-700 text-sm leading-relaxed">
                    <p>Dear John Anderson,</p>
                    <br />
                    <p>Thank you for your interest in our Personal Loan services.</p>
                    <br />
                    <p>I wanted to follow up regarding your application. Let me know if you have any questions.</p>
                    <br />
                    <div className="border-t border-slate-200 pt-4 mt-4">
                      <p className="font-semibold text-slate-900">Best regards,</p>
                      <br />
                      <p className="font-medium text-slate-900">Sarah Mitchell</p>
                      <p className="text-slate-600">Senior Loan Officer</p>
                      <p className="text-slate-600">H Financial Services</p>
                      <p className="text-slate-600">📞 (555) 123-4567</p>
                      <p className="text-indigo-600">📧 sarah@hfinancial.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE: Reports & Analytics */}
        <section className="py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Mockup */}
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-200/50 to-purple-200/50 blur-3xl rounded-full" />
                <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="font-semibold text-slate-900">Company Insights</div>
                    <div className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded-full">Last 30 Days</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
                      <div className="text-xs text-violet-600 uppercase font-semibold mb-1">Total Funded</div>
                      <div className="text-2xl font-bold text-slate-900">$2.4M</div>
                      <div className="text-xs text-blue-600 font-medium">↑ 12% vs last month</div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <div className="text-xs text-blue-600 uppercase font-semibold mb-1">Conversion</div>
                      <div className="text-2xl font-bold text-slate-900">34%</div>
                      <div className="text-xs text-blue-600 font-medium">↑ 5% improvement</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: "Sarah M.", amount: "$485,000", count: 12, color: "violet" },
                      { name: "Mike K.", amount: "$392,000", count: 9, color: "emerald" },
                      { name: "Lisa R.", amount: "$315,000", count: 8, color: "teal" },
                    ].map((officer, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full bg-${officer.color}-100 flex items-center justify-center text-xs font-bold text-${officer.color}-600`}>
                            {officer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium text-slate-900">{officer.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900">{officer.amount}</div>
                          <div className="text-xs text-slate-500">{officer.count} deals</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
                  <BarChart3 className="h-4 w-4" />
                  Business Intelligence
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                  Know your
                  <span className="text-violet-600"> numbers.</span>
                </h3>

                <p className="text-xl text-slate-600 leading-relaxed">
                  Real-time dashboards for admins. Track total funded, conversion rates, and per-officer performance.
                </p>

                <div className="space-y-3 pt-4">
                  {[
                    { title: "Company Analytics", desc: "Total volume, revenue, pipeline health" },
                    { title: "Per-Officer Breakdown", desc: "See who's crushing goals" },
                    { title: "PDF Export", desc: "One-click reports for stakeholders" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-violet-500 shrink-0" />
                      <span className="text-slate-700"><span className="font-medium">{item.title}</span> — {item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MORE FEATURES GRID */}
        <section className="py-24 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">And There&apos;s More...</h3>
              <p className="text-lg text-slate-500">Every detail is designed to make your workflow faster.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Settings, title: "Profile Settings", desc: "Customize email provider, templates, and signature in one place." },
                { icon: PenTool, title: "Edit Lead Details", desc: "Full wizard form to update any lead information." },
                { icon: UserCheck, title: "Role-Based Access", desc: "Admins see everything. Loan officers see their leads." },
                { icon: FileText, title: "Lead Application", desc: "Public apply page with geolocation and duplicate detection." },
                { icon: Send, title: "Funding Details", desc: "Track PSI date, funding amount, fees, and dealer info." },
                { icon: RefreshCw, title: "Status Pipeline", desc: "From New → Connected → Qualified → Funded." },
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-shadow">
                  <feature.icon className="h-8 w-8 text-blue-600 mb-4" />
                  <h4 className="font-semibold text-slate-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">Pricing</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Simple, transparent pricing
              </h3>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                No hidden fees. No surprises. Cancel anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Starter */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col">
                <h4 className="text-xl font-semibold text-slate-900 mb-2">Starter</h4>
                <p className="text-slate-500 text-sm mb-6">For individual loan officers</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">$29</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {["Up to 100 leads", "Basic analytics", "Email templates", "Personal reminders"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>

              {/* Pro - Featured */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-500 to-indigo-600 border border-blue-400 flex flex-col relative shadow-2xl shadow-blue-200/50">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-amber-900 text-sm font-bold rounded-full shadow-lg">
                  Most Popular
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">Pro</h4>
                <p className="text-blue-100 text-sm mb-6">For growing lending teams</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$79</span>
                  <span className="text-blue-200">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {["Unlimited leads", "Team chat", "Company announcements", "Advanced analytics", "Email with signatures", "Priority support"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-white text-sm">
                      <CheckCircle className="h-4 w-4 text-white" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full bg-white hover:bg-slate-100 text-blue-600 font-semibold">
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </div>

              {/* Enterprise */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col">
                <h4 className="text-xl font-semibold text-slate-900 mb-2">Enterprise</h4>
                <p className="text-slate-500 text-sm mb-6">For large lending operations</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">Custom</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {["Everything in Pro", "Dedicated account manager", "Custom integrations", "SLA guarantee", "On-premise option"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full border-slate-300 text-slate-900 hover:bg-slate-100">
                  <Link href="mailto:sales@leadforge.com">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to close more loans?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
              Join loan officers who are already using LeadForge to streamline their workflow and grow their business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="h-14 px-10 text-lg bg-white text-blue-600 hover:bg-slate-100 rounded-full font-semibold shadow-xl">
                <Link href="/signup">
                  Start Free Trial
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="h-14 px-10 text-lg border-white/30 text-white hover:bg-white/10 rounded-full">
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-slate-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-white">LeadForge</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-400">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/developer" className="hover:text-white transition-colors">Developer</Link>
              <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            </div>
            <div className="text-sm text-slate-500">
              © 2024 LeadForge. Canadian Built 🇨🇦
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
