"use client";

import React, { useState } from "react";
import { Phone, Rocket, Target, Users, Zap } from "lucide-react";
import AppNav from "@/app/components/AppNav";

export default function AetherPage() {
  const [campaignName, setCampaignName] = useState("");
  const [targetKeywords, setTargetKeywords] = useState(
    'SaaS founder OR CTO OR "AI startup" OR "software company" Australia'
  );
  const [dailyLimit, setDailyLimit] = useState(100);
  const [status, setStatus] = useState("");
  const [launching, setLaunching] = useState(false);

  const startCampaign = async () => {
    setLaunching(true);
    setStatus("Launching Aether campaign...");

    try {
      const res = await fetch("/api/aether/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignName, targetKeywords, dailyLimit }),
      });
      const data = await res.json();
      setStatus(
        data.message ||
          "Campaign launched — monitoring live in Supabase dashboard"
      );
    } catch {
      setStatus(
        "Campaign stub activated — connect Apollo & Retell API keys to go live."
      );
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <AppNav />

      <div className="max-w-4xl mx-auto p-6 pt-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/50 text-violet-400 text-sm mb-4">
            <Phone className="w-4 h-4" /> Autonomous Sales Agent
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-3">
            Aether
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Find contacts → Personalised outreach → Real-time voice calls →
            Qualify & book meetings. Fully autonomous, Australia-compliant.
          </p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
            <Target className="w-6 h-6 text-violet-400 mx-auto mb-2" />
            <div className="text-xs font-medium">Find Leads</div>
            <div className="text-[10px] text-zinc-500">Apollo.io</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-xs font-medium">Outreach</div>
            <div className="text-[10px] text-zinc-500">Email + LinkedIn</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
            <Phone className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-xs font-medium">Voice Calls</div>
            <div className="text-[10px] text-zinc-500">Retell AI</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-xs font-medium">Book Meetings</div>
            <div className="text-[10px] text-zinc-500">Calendly</div>
          </div>
        </div>

        {/* Campaign Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Launch Campaign</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Feb 2026 Perth SaaS Founders"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Target Keywords / Persona
              </label>
              <input
                type="text"
                value={targetKeywords}
                onChange={(e) => setTargetKeywords(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Daily Contact Limit (recommended 50–200)
              </label>
              <input
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
              />
            </div>
            <button
              onClick={startCampaign}
              disabled={!campaignName || launching}
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3"
            >
              <Rocket className="w-5 h-5" />
              {launching
                ? "Launching..."
                : "Launch Fully Autonomous Aether Campaign"}
            </button>
            {status && (
              <div className="text-center text-emerald-400 font-medium mt-4 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
                {status}
              </div>
            )}
          </div>
        </div>

        {/* Retell Voice Agent Info */}
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3">
            Voice Agent Script (Retell AI)
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            Aether uses an adaptive on-the-fly AI script that works for anyone
            who answers — receptionist, volunteer, founder, CEO, CTO. It elicits
            their role, delivers RaaS value, and books meetings.
          </p>
          <div className="bg-zinc-800 rounded-xl p-4 text-xs text-zinc-300 font-mono overflow-x-auto">
            <pre>{`Opening: "Hi, this is Aether from Lumina RaaS in Perth.
I help businesses get real software outcomes delivered 
with zero upfront risk. Do you have 30 seconds?"

→ Elicit role → Deliver value → Book meeting or send email`}</pre>
          </div>
        </div>

        {/* Cost info */}
        <div className="mt-8 text-center text-sm text-zinc-500">
          <p>
            Cost: ~$0.17–0.20 per connected minute (Retell $0.07 + AU telephony
            $0.10). First 1,000 minutes effectively free with credits.
          </p>
        </div>
      </div>
    </div>
  );
}
