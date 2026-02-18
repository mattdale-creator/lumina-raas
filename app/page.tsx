"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Check,
  Users,
  Zap,
  Shield,
  Brain,
  Star,
  Menu,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "Autonomous AI Agents",
    desc: "Ralph-loop powered agents that self-tweak and iterate code continuously until success criteria are met.",
  },
  {
    icon: Zap,
    title: "Full Software Path Coverage",
    desc: "From PRDs to CI/CD, payments, analytics — 12 modular outcomes, all automated.",
  },
  {
    icon: Users,
    title: "Multi-Agent Orchestration",
    desc: "Specialized agents collaborate in real time across your entire stack.",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    desc: "SOC2-ready architecture, encrypted data, role-based access from day one.",
  },
  {
    icon: Star,
    title: "Instant Deployments",
    desc: "Vercel + Supabase ready. Production in minutes, not months.",
  },
  {
    icon: Check,
    title: "Self-Improving Codebase",
    desc: "Persistent loops refine, test, and optimize until every metric is green.",
  },
];

const pricingTiers = [
  {
    name: "Free Pilot",
    price: "$0",
    period: "until delivered",
    desc: "One PRD or mini-outcome at no cost",
    features: [
      "1 outcome delivered free",
      "Basic dashboard",
      "Community support",
    ],
    cta: "Start Free Pilot",
    highlight: false,
  },
  {
    name: "Pay-per-Result",
    price: "$2,500+",
    period: "per verified result",
    desc: "Single major outcomes like a full MVP",
    features: [
      "Complete SaaS MVP",
      "Payments & analytics",
      "Priority support",
      "Real-time monitoring",
    ],
    cta: "Get Started",
    highlight: true,
  },
  {
    name: "RaaS Growth",
    price: "$499",
    period: "/month + success fees",
    desc: "Ongoing outcomes with autonomous sales",
    features: [
      "4-6 outcomes/month",
      "Aether sales agent",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

const faqs = [
  {
    q: "How does Lumina RaaS accelerate company launches?",
    a: "By orchestrating AI agents across 12 modular PRDs, reducing development time from months to days. You define the outcome; we deliver it.",
  },
  {
    q: "What does 'pay only for delivered results' mean?",
    a: "You pay nothing until the outcome is live, verified, and meets your success criteria. No result = no invoice.",
  },
  {
    q: "Is the platform production-ready?",
    a: "Yes. Built on Next.js, Supabase, Stripe, and Vercel with 99.9% uptime SLAs and enterprise-grade security.",
  },
  {
    q: "Can I customize the AI agents?",
    a: "Completely. Every Ralph loop prompt and agent role is fully configurable to your domain and stack.",
  },
];

export default function LandingPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center font-bold text-lg">
              L
            </div>
            <span className="font-semibold text-2xl tracking-tighter">
              Lumina RaaS
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-violet-400 transition">
              Features
            </a>
            <a href="#pricing" className="hover:text-violet-400 transition">
              Pricing
            </a>
            <a href="#faq" className="hover:text-violet-400 transition">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/sign-in"
              className="hidden md:block text-sm font-medium hover:text-violet-400 transition"
            >
              Log in
            </a>
            <a
              href="#contact"
              className="px-5 py-2.5 bg-white text-black rounded-full font-medium text-sm hover:bg-zinc-200 transition flex items-center gap-2"
            >
              Start Free Pilot <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-6 py-6 space-y-4">
            <a href="#features" className="block hover:text-violet-400">
              Features
            </a>
            <a href="#pricing" className="block hover:text-violet-400">
              Pricing
            </a>
            <a href="#faq" className="block hover:text-violet-400">
              FAQ
            </a>
            <a href="/sign-in" className="block hover:text-violet-400">
              Log in
            </a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/50 text-emerald-400 text-sm mb-6">
            <span className="text-emerald-400">●</span> Pay Only for Delivered
            Results
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            Lumina RaaS.
            <br />
            <span className="gradient-text">
              We deliver your complete software business — or you pay nothing.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-400 mb-10">
            12 modular PRDs. Autonomous AI agents. Persistent Ralph loops that
            self-tweak code until every success criterion is met. Define your
            outcome. We deliver it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="px-10 py-4 bg-violet-600 rounded-full font-semibold text-lg hover:bg-violet-700 transition flex items-center justify-center gap-3"
            >
              Start Free Pilot <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#features"
              className="px-10 py-4 border border-zinc-700 rounded-full font-semibold text-lg hover:border-zinc-500 transition text-center"
            >
              See How It Works
            </a>
          </div>
        </motion.div>
      </section>

      {/* RaaS Guarantee */}
      <section className="py-16 bg-zinc-900 border-t border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 text-emerald-400 mb-6">
            <Shield className="w-6 h-6" /> 100% Results Guarantee
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4">
            Zero risk. Pure outcomes.
          </h2>
          <p className="text-lg text-zinc-400">
            Define your target result. Our agents work until it is achieved and
            verified. No result = no invoice. Ever.
          </p>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 border-b border-zinc-800">
        <p className="text-center text-sm text-zinc-500 mb-6">
          Built on trusted infrastructure
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-50">
          {["Next.js", "Supabase", "Stripe", "Vercel", "Clerk"].map((name) => (
            <div key={name} className="text-xl font-bold tracking-tighter">
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4">
            Delivered Results, Not Software
          </h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            Every PRD ends with a live, production-ready outcome — paid only
            when you confirm success.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 transition-all"
            >
              <f.icon className="w-10 h-10 text-violet-500 mb-6" />
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-zinc-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4">
              Pay Only for Delivered Results
            </h2>
            <p className="text-zinc-400">
              Start free. Scale when you grow. No result, no payment.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <div
                key={i}
                className={`rounded-3xl p-8 border ${
                  tier.highlight
                    ? "border-violet-500 bg-zinc-950 ring-1 ring-violet-500/50"
                    : "border-zinc-800 bg-zinc-950"
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-zinc-400 text-sm">{tier.period}</span>
                </div>
                <p className="text-zinc-400 text-sm mb-6">{tier.desc}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`block text-center py-3 rounded-full font-medium text-sm transition ${
                    tier.highlight
                      ? "bg-violet-600 hover:bg-violet-700"
                      : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-center mb-16">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-6"
            >
              <summary className="font-semibold cursor-pointer flex justify-between items-center list-none">
                {faq.q}
                <span className="text-xl group-open:rotate-180 transition-transform ml-4">
                  ↓
                </span>
              </summary>
              <p className="mt-4 text-zinc-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact / CTA */}
      <section
        id="contact"
        className="py-24 border-t border-zinc-800 bg-zinc-950"
      >
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-6">
            Define your outcome. We deliver it.
          </h2>
          <p className="text-lg text-zinc-400 mb-12">
            First result delivered free. Subsequent outcomes invoiced only on
            verified success.
          </p>

          {formSubmitted ? (
            <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-400 p-8 rounded-2xl text-lg">
              Thank you! We&apos;ll be in touch within 24 hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-6 py-4 focus:outline-none focus:border-violet-500 transition"
                required
              />
              <input
                type="email"
                placeholder="Work email"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-6 py-4 focus:outline-none focus:border-violet-500 transition"
                required
              />
              <textarea
                placeholder="Tell us about your product idea (optional)"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-6 py-4 h-32 focus:outline-none focus:border-violet-500 transition resize-none"
              />
              <button
                type="submit"
                className="w-full py-4 bg-white text-black rounded-xl font-semibold text-lg hover:bg-zinc-200 transition"
              >
                Request Early Access
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-6 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>© 2026 Lumina RaaS. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms
            </a>
            <a href="#" className="hover:text-white transition">
              Docs
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
