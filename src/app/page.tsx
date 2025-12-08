import Link from "next/link";
import { ArrowRight, Shield, Clock, TrendingUp, CheckCircle, Smartphone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="/">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">LeadForge</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-bold text-primary hover:underline underline-offset-4" href="/apply">
            Apply Now
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Company Login
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Financial Freedom Starts Here
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  It&apos;s fast, secure, and transparent access to Personal Loans, Debt Consolidation, and Home Equity solutions.
                </p>
              </div>
              <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-flex gap-4">
                <Button variant="outline" size="lg" asChild className="h-12 px-8">
                  <Link href="#loan-types">
                    Explore Loans
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Loan Types */}
        <section id="loan-types" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12">Our Loan Solutions</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 bg-blue-50 rounded-full">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Personal Loans</h3>
                <p className="text-center text-gray-500">
                  Quick access to funds for any purpose. Competitive rates and flexible terms.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 bg-green-50 rounded-full">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Debt Consolidation</h3>
                <p className="text-center text-gray-500">
                  Combine your debts into one manageable payment and lower your interest.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 bg-purple-50 rounded-full">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">Home Equity Loans</h3>
                <p className="text-center text-gray-500">
                  Leverage your home&apos;s value for larger expenses or renovations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-xl mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Apply Online</h3>
                <p className="text-gray-500">Fill out our simple, secure application form in minutes.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-xl mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Get Verified</h3>
                <p className="text-gray-500">We quickly verify your information to match you with the best options.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-xl mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Receive Funds</h3>
                <p className="text-gray-500">Once approved, funds are deposited directly into your account.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="w-full py-12 md:py-24 bg-white border-t">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 md:grid-cols-3 text-center">
              <div className="flex flex-col items-center">
                <Lock className="h-10 w-10 text-gray-400 mb-2" />
                <h4 className="font-semibold">Bank-Level Security</h4>
                <p className="text-sm text-gray-500">Your data is encrypted and protected.</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="h-10 w-10 text-gray-400 mb-2" />
                <h4 className="font-semibold">Fast Decisions</h4>
                <p className="text-sm text-gray-500">Get answers quickly, often same-day.</p>
              </div>
              <div className="flex flex-col items-center">
                <Smartphone className="h-10 w-10 text-gray-400 mb-2" />
                <h4 className="font-semibold">Mobile Friendly</h4>
                <p className="text-sm text-gray-500">Apply from anywhere, anytime.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2025 LeadForge Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy-policy">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
        </nav>
      </footer>
    </div>
  );
}
