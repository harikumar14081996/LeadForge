import Link from "next/link";
import { ArrowRight, Shield, TrendingUp, CheckCircle, Menu, Users, MessageSquare, Bell, Mail, BarChart3, Clock, Zap, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black font-sans selection:bg-blue-500/30">
      {/* Header - Apple Style */}
      <header className="px-4 lg:px-6 h-12 flex items-center bg-black/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/10">
        <Link className="flex items-center justify-center group" href="/">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <span className="ml-2 text-lg font-semibold text-white">LeadForge</span>
        </Link>

        <nav className="ml-auto flex gap-6 items-center">
          <Link className="text-sm text-zinc-400 hover:text-white transition-colors hidden md:block" href="#features">
            Features
          </Link>
          <Link className="text-sm text-zinc-400 hover:text-white transition-colors hidden md:block" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm text-zinc-400 hover:text-white transition-colors hidden md:block" href="/developer">
            Developer
          </Link>
          <Link className="text-sm text-blue-400 hover:text-blue-300 transition-colors" href="/login">
            Sign In
          </Link>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800">
              <DropdownMenuItem asChild>
                <Link href="#features" className="text-white">Features</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#pricing" className="text-white">Pricing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/developer" className="text-white">Developer</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>

      <main className="flex-1">
        {/* HERO - Steve Jobs Style Announcement */}
        <section className="relative min-h-[90vh] flex items-center justify-center bg-black overflow-hidden">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px]" />

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-zinc-300">Now with Team Chat, Reminders & Email Signatures</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[0.9]">
                Close More Loans.
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
                  Less Chaos.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl leading-relaxed">
                The all-in-one platform for loan officers and lending companies.
                <br className="hidden sm:block" />
                <span className="text-white font-medium">Manage leads. Chat with your team. Get funded faster.</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Button size="lg" asChild className="h-14 px-10 text-lg bg-white text-black hover:bg-zinc-100 rounded-full font-semibold">
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-14 px-10 text-lg border-zinc-700 text-white hover:bg-white/10 rounded-full">
                  <Link href="#features">
                    See Features
                  </Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-8 pt-12 text-zinc-500 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Bank-Grade Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Real-time Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Canadian Built</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE 1: Lead Management - Steve Jobs Reveal */}
        <section id="features" className="relative py-32 bg-black overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            {/* Section Header */}
            <div className="text-center mb-20">
              <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Lead Management</h2>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Every lead. One place.
              </h3>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                No more scattered spreadsheets. See your entire pipeline at a glance.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group p-8 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-blue-500/50 transition-all duration-300">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                  <Users className="h-7 w-7 text-blue-400 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">360° Lead Profile</h4>
                <p className="text-zinc-400">Employment, assets, vehicle details, SIN encryption — everything in one secure file.</p>
              </div>

              <div className="group p-8 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-green-500/50 transition-all duration-300">
                <div className="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors">
                  <TrendingUp className="h-7 w-7 text-green-400 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">Status Pipeline</h4>
                <p className="text-zinc-400">From New → In Progress → Approved → Funded. Track every step without missing one.</p>
              </div>

              <div className="group p-8 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-purple-500/50 transition-all duration-300">
                <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
                  <CheckCircle className="h-7 w-7 text-purple-400 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-3">Auto Fee Calculation</h4>
                <p className="text-zinc-400">PPSR, admin fees, dealer costs — calculated automatically when you enter funding details.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE 2: Team Chat - "One More Thing" */}
        <section className="relative py-32 bg-gradient-to-b from-black via-blue-950/20 to-black overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[200px]" />

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  Built-in Messaging
                </div>

                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  One more thing.
                  <br />
                  <span className="text-zinc-400">Team Chat.</span>
                </h3>

                <p className="text-xl text-zinc-400 leading-relaxed">
                  No more switching to Slack or WhatsApp.
                  <span className="text-white font-medium"> Discuss leads in context.</span>
                  Mention teammates. Get instant notifications.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: MessageSquare, title: "1:1 & Group Chats", desc: "Private DMs or team channels" },
                    { icon: Users, title: "@Mention Anyone", desc: "Type @ and watch the magic" },
                    { icon: Bell, title: "Real-time Notifications", desc: "Never miss an important message" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                        <item.icon className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{item.title}</div>
                        <div className="text-sm text-zinc-500">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Chat Mockup */}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
                <div className="relative bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-800 p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-sm text-white">LT</div>
                    <div>
                      <div className="font-semibold text-white">Lending Team</div>
                      <div className="text-xs text-zinc-500">Sarah, Mike, Lisa</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-zinc-500">Online</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white shrink-0">SM</div>
                      <div className="bg-zinc-800 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                        <div className="text-xs text-purple-400 font-medium">Sarah M.</div>
                        <div className="text-sm text-zinc-200">Anderson file is funded! 🎉</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white shrink-0">MK</div>
                      <div className="bg-zinc-800 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                        <div className="text-xs text-green-400 font-medium">Mike K.</div>
                        <div className="text-sm text-zinc-200"><span className="bg-blue-500/30 text-blue-300 px-1 rounded">@Sarah</span> $45K this week!</div>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <div className="bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                        <div className="text-sm text-white">Team meeting at 3pm <span className="bg-white/20 px-1 rounded">@everyone</span></div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">You</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE 3: Reminders & Announcements */}
        <section className="relative py-32 bg-gradient-to-b from-black via-amber-950/20 to-black overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[200px]" />

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Reminder Mockup */}
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full" />
                <div className="relative space-y-4">
                  {/* Admin Reminder */}
                  <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-800 p-5 shadow-xl">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                        <Bell className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-amber-400 uppercase">Company Announcement</span>
                          <span className="text-xs text-zinc-500">Just now</span>
                        </div>
                        <div className="font-semibold text-white mt-1">End-of-Month Pipeline Check</div>
                        <div className="text-sm text-zinc-400 mt-1">All loan officers: Submit your EOM forecasts by Friday.</div>
                        <div className="flex gap-2 mt-3">
                          <button className="px-4 py-1.5 rounded-full bg-amber-500 text-white text-sm font-medium">Mark Done</button>
                          <button className="px-4 py-1.5 rounded-full bg-zinc-700 text-white text-sm">Snooze</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Reminder */}
                  <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-800 p-5 shadow-xl">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-blue-400 uppercase">Personal Reminder</span>
                          <span className="text-xs text-zinc-500">Repeats Daily @ 9:00 AM</span>
                        </div>
                        <div className="font-semibold text-white mt-1">Follow up on pending docs</div>
                        <div className="text-sm text-zinc-400 mt-1">Check for missing documents from clients.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="space-y-8 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium">
                  <Bell className="h-4 w-4" />
                  Smart Reminders
                </div>

                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Never forget
                  <br />
                  <span className="text-zinc-400">a follow-up.</span>
                </h3>

                <p className="text-xl text-zinc-400 leading-relaxed">
                  Admins broadcast company-wide announcements.
                  <span className="text-white font-medium"> Loan officers set personal reminders.</span>
                  Scheduled notifications pop up right on time.
                </p>

                <div className="space-y-4">
                  {[
                    { title: "Company Announcements", desc: "Broadcast to entire team with acknowledgment tracking" },
                    { title: "Personal Reminders", desc: "Daily, weekly, or specific day scheduling" },
                    { title: "Popup Notifications", desc: "Never miss a reminder — they come to you" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-amber-400 shrink-0" />
                      <div>
                        <span className="font-medium text-white">{item.title}</span>
                        <span className="text-zinc-500"> — {item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE 4: Email with Signature - NEW */}
        <section className="relative py-32 bg-gradient-to-b from-black via-green-950/20 to-black overflow-hidden">
          <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[200px]" />

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  One-Click Email
                </div>

                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Contact leads
                  <br />
                  <span className="text-zinc-400">in seconds.</span>
                </h3>

                <p className="text-xl text-zinc-400 leading-relaxed">
                  Click &quot;Send Email&quot; on any lead.
                  <span className="text-white font-medium"> Your email opens with a prefilled message.</span>
                  Subject, body, and professional signature — all ready to send.
                </p>

                <div className="space-y-4">
                  {[
                    { title: "Template Placeholders", desc: "{name} and {loan_type} auto-filled" },
                    { title: "Professional Signature", desc: "Your name, title, phone, and email appended" },
                    { title: "Works with Any Provider", desc: "Gmail, Outlook, Yahoo, iCloud, ProtonMail" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
                      <div>
                        <span className="font-medium text-white">{item.title}</span>
                        <span className="text-zinc-500"> — {item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Email Mockup */}
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full" />
                <div className="relative bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-800 p-6 shadow-2xl">
                  <div className="bg-zinc-800 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                      <span className="font-medium text-zinc-300">To:</span>
                      <span>john.anderson@email.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <span className="font-medium text-zinc-300">Subject:</span>
                      <span>Regarding Your Personal Loan Application</span>
                    </div>
                  </div>

                  <div className="bg-zinc-950 rounded-xl p-4 text-zinc-300 text-sm leading-relaxed">
                    <p>Dear John Anderson,</p>
                    <br />
                    <p>Thank you for your interest in our Personal Loan services.</p>
                    <br />
                    <p>I wanted to follow up regarding your loan application. Please let me know if you have any questions.</p>
                    <br />
                    <p>Looking forward to hearing from you.</p>
                    <br />
                    <div className="border-t border-zinc-800 pt-4 mt-4">
                      <p className="font-semibold text-white">Best regards,</p>
                      <br />
                      <p className="text-white font-medium">Sarah Mitchell</p>
                      <p>Senior Loan Officer</p>
                      <p>H Financial Services</p>
                      <p>📞 (555) 123-4567</p>
                      <p>📧 sarah@hfinancial.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE 5: Reports & Analytics */}
        <section className="relative py-32 bg-gradient-to-b from-black via-purple-950/20 to-black overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[200px]" />

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Reports Mockup */}
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full" />
                <div className="relative bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-800 p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="font-semibold text-white">Company Insights</div>
                    <div className="text-xs text-zinc-500">Last 30 Days</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-zinc-800/50 rounded-xl p-4">
                      <div className="text-xs text-purple-400 uppercase font-semibold mb-1">Total Funded</div>
                      <div className="text-2xl font-bold text-white">$2.4M</div>
                      <div className="text-xs text-green-400">↑ 12% vs last month</div>
                    </div>
                    <div className="bg-zinc-800/50 rounded-xl p-4">
                      <div className="text-xs text-purple-400 uppercase font-semibold mb-1">Conversion Rate</div>
                      <div className="text-2xl font-bold text-white">34%</div>
                      <div className="text-xs text-green-400">↑ 5% improvement</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: "Sarah M.", amount: "$485,000", count: 12 },
                      { name: "Mike K.", amount: "$392,000", count: 9 },
                      { name: "Lisa R.", amount: "$315,000", count: 8 },
                    ].map((officer, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">
                            {officer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-white font-medium">{officer.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{officer.amount}</div>
                          <div className="text-xs text-zinc-500">{officer.count} deals</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="space-y-8 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium">
                  <BarChart3 className="h-4 w-4" />
                  Business Intelligence
                </div>

                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Know your
                  <br />
                  <span className="text-zinc-400">numbers.</span>
                </h3>

                <p className="text-xl text-zinc-400 leading-relaxed">
                  Real-time dashboards for admins.
                  <span className="text-white font-medium"> See total funded, conversion rates, and per-officer performance.</span>
                  Export to PDF with one click.
                </p>

                <div className="space-y-4">
                  {[
                    { title: "Company-Wide Analytics", desc: "Total volume, revenue, pipeline health" },
                    { title: "Per-Officer Breakdown", desc: "See who's crushing it and who needs help" },
                    { title: "PDF Export", desc: "One-click reports for stakeholders" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-purple-400 shrink-0" />
                      <div>
                        <span className="font-medium text-white">{item.title}</span>
                        <span className="text-zinc-500"> — {item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="relative py-32 bg-black overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-blue-950/10 to-black" />

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Pricing</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Simple, transparent pricing
              </h3>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                No hidden fees. No surprises. Cancel anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Starter */}
              <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col">
                <h4 className="text-xl font-semibold text-white mb-2">Starter</h4>
                <p className="text-zinc-400 text-sm mb-6">Perfect for individual loan officers</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$29</span>
                  <span className="text-zinc-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {["Up to 100 leads", "Basic analytics", "Email templates", "Personal reminders"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-zinc-300 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>

              {/* Pro - Featured */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-600 to-blue-700 border border-blue-500 flex flex-col relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-blue-600 text-sm font-semibold rounded-full">
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
                <Button asChild className="w-full bg-white hover:bg-zinc-100 text-blue-600">
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </div>

              {/* Enterprise */}
              <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col">
                <h4 className="text-xl font-semibold text-white mb-2">Enterprise</h4>
                <p className="text-zinc-400 text-sm mb-6">For large lending operations</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">Custom</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {["Everything in Pro", "Dedicated account manager", "Custom integrations", "SLA guarantee", "On-premise option"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-zinc-300 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800">
                  <Link href="mailto:sales@leadforge.com">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-32 bg-gradient-to-t from-blue-600 to-black overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />

          <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to close more loans?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
              Join hundreds of loan officers who are already using LeadForge to streamline their workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="h-14 px-10 text-lg bg-white text-blue-600 hover:bg-zinc-100 rounded-full font-semibold">
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
      <footer className="py-12 bg-black border-t border-zinc-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-white">LeadForge</span>
            </div>
            <div className="flex gap-8 text-sm text-zinc-500">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/developer" className="hover:text-white transition-colors">Developer</Link>
              <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            </div>
            <div className="text-sm text-zinc-600">
              © 2024 LeadForge. Canadian Built.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
