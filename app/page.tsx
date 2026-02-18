'use client';

import React, { useState } from 'react';
import { Menu, X, ArrowRight, Check, Zap, Shield, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const features = [
    { icon: Brain, title: 'Autonomous AI Agents', desc: 'Ralph-loop powered agents that self-tweak and iterate code continuously.' },
    { icon: Zap, title: 'Full Software Path Coverage', desc: 'From PRDs to CI/CD, payments, analytics – everything automated.' },
    { icon: Shield, title: 'Enterprise-Grade Security', desc: 'SOC2-ready, encrypted, role-based access.' },
  ];

  const faqs = [
    { q: 'How does Lumina accelerate company launches?', a: 'By orchestrating AI agents across all 12 PRDs, reducing development time from months to days.' },
    { q: 'Is the platform production-ready?', a: 'Yes. Built on Next.js 15, Supabase, Stripe, and Vercel with 99.9% uptime SLAs.' },
    { q: 'What does "pay only for delivered results" mean?', a: 'You define your outcome. Our agents deliver it. You only pay when it is verified and live.' },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center font-bold text-lg">L</div>
            <span className="font-semibold text-2xl tracking-tighter">Lumina RaaS</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-violet-400 transition">Features</a>
            <a href="#faq" className="hover:text-violet-400 transition">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="#contact" className="px-5 py-2.5 bg-white text-black rounded-full font-medium text-sm hover:bg-zinc-200 transition flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </a>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 text-sm mb-6">
            <span className="text-emerald-400">●</span> Now in public beta
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            Lumina RaaS.<br />
            <span className="gradient-text">We deliver your complete software business — or you pay nothing.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-zinc-400 mb-10">
            12 modular PRDs. Multi-agent orchestration. Ralph loops that make code tweak itself until perfect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="px-10 py-4 bg-violet-600 rounded-full font-semibold text-lg hover:bg-violet-700 transition flex items-center justify-center gap-3">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#" className="px-10 py-4 border border-zinc-700 rounded-full font-semibold text-lg hover:border-zinc-500 transition">
              Watch 2-min demo
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold tracking-tighter mb-4">Everything your startup needs</h2>
          <p className="text-zinc-400 max-w-md mx-auto">Built-in Ralph loops ensure every component self-improves until it meets your exact success criteria.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} whileHover={{ y: -4 }} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <f.icon className="w-10 h-10 text-violet-500 mb-6" />
              <h3 className="text-2xl font-semibold mb-3">{f.title}</h3>
              <p className="text-zinc-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold tracking-tighter text-center mb-16">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-6">
              <summary className="font-semibold cursor-pointer flex justify-between items-center list-none">
                {faq.q}
                <span className="text-xl group-open:rotate-180 transition">↓</span>
              </summary>
              <p className="mt-6 text-zinc-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="py-24 border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold tracking-tighter mb-6">Ready to launch?</h2>
          <p className="text-xl text-zinc-400 mb-12">Join founders who ship complete software companies in days, not months.</p>

          {formSubmitted ? (
            <div className="bg-emerald-900/50 border border-emerald-500 text-emerald-400 p-8 rounded-3xl text-xl">Thank you. We will contact you within 24 hours.</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" placeholder="Your name" className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-violet-500 text-white placeholder-zinc-500" required />
              <input type="email" placeholder="Work email" className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-violet-500 text-white placeholder-zinc-500" required />
              <button type="submit" className="w-full py-4 bg-white text-black rounded-2xl font-semibold text-lg hover:bg-zinc-200 transition">
                Request Early Access
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-16 px-6 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>© 2026 Lumina RaaS. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Docs</a>
          </div>
        </div>
      </footer>
    </>
  );
}
