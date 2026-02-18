"use client";

import React, { useState } from "react";
import AppNav from "@/app/components/AppNav";
import { trpc } from "@/lib/trpc-client";
import {
  Plus,
  Zap,
  Check,
  Clock,
  DollarSign,
  BarChart3,
  Phone,
  Shield,
  X,
} from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  pending: "bg-zinc-700 text-zinc-300",
  in_progress: "bg-blue-900 text-blue-300",
  delivered: "bg-violet-900 text-violet-300",
  verified: "bg-emerald-900 text-emerald-300",
  paid: "bg-green-900 text-green-300",
};

const statusProgress: Record<string, number> = {
  pending: 10,
  in_progress: 40,
  delivered: 70,
  verified: 90,
  paid: 100,
};

export default function DashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const outcomes = trpc.outcome.getAll.useQuery();
  const createOutcome = trpc.outcome.create.useMutation({
    onSuccess: () => {
      outcomes.refetch();
      setShowCreateModal(false);
      setTitle("");
      setDescription("");
    },
  });

  const data = outcomes.data || [];
  const active = data.filter((o) => o.status !== "paid").length;
  const verified = data.filter(
    (o) => o.status === "verified" || o.status === "paid"
  ).length;

  return (
    <div className="min-h-screen bg-zinc-950">
      <AppNav />

      <div className="max-w-7xl mx-auto p-6 pt-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">
              RaaS Dashboard
            </h1>
            <p className="text-zinc-400 mt-1">
              Your outcomes — delivered or in progress. Pay only when verified.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl font-medium transition"
          >
            <Plus className="w-4 h-4" /> Define New Outcome
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-zinc-400">Active Outcomes</span>
              <Zap className="w-5 h-5 text-violet-400" />
            </div>
            <div className="text-4xl font-bold">{active}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-zinc-400">Verified Results</span>
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-4xl font-bold">{verified}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-zinc-400">Total Outcomes</span>
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-4xl font-bold">{data.length}</div>
          </div>
        </div>

        {/* Outcome list */}
        <div className="space-y-4">
          {data.length === 0 && !outcomes.isLoading && (
            <div className="text-center py-20 border border-zinc-800 rounded-2xl bg-zinc-900/50">
              <Shield className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No outcomes yet</h3>
              <p className="text-zinc-400 mb-6">
                Define your first RaaS outcome and our agents will deliver it.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl font-medium transition"
              >
                Create First Outcome
              </button>
            </div>
          )}

          {outcomes.isLoading && (
            <div className="text-center py-20 text-zinc-500">
              Loading outcomes...
            </div>
          )}

          {data.map((outcome) => (
            <Link
              key={outcome.id}
              href={`/dashboard/${outcome.id}`}
              className="block bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-violet-500/50 transition"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{outcome.title}</h3>
                  {outcome.description && (
                    <p className="text-zinc-400 text-sm mt-1">
                      {outcome.description}
                    </p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium self-start ${
                    statusColors[outcome.status] || "bg-zinc-700"
                  }`}
                >
                  {outcome.status.replace("_", " ")}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
                <div
                  className="bg-violet-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${statusProgress[outcome.status] || 0}%`,
                  }}
                />
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(outcome.created_at).toLocaleDateString()}
                </span>
                {outcome.amount_cents > 0 && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />$
                    {(outcome.amount_cents / 100).toFixed(2)} AUD
                  </span>
                )}
                {outcome.verified_at && (
                  <span className="text-emerald-400">✓ Verified</span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/aether"
            className="flex items-center gap-4 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-violet-500/50 transition"
          >
            <Phone className="w-8 h-8 text-violet-400" />
            <div>
              <h3 className="font-semibold">Launch Aether Sales</h3>
              <p className="text-sm text-zinc-400">
                Autonomous AI sales agent — pay per booked meeting
              </p>
            </div>
          </Link>
          <Link
            href="/analytics"
            className="flex items-center gap-4 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-violet-500/50 transition"
          >
            <BarChart3 className="w-8 h-8 text-emerald-400" />
            <div>
              <h3 className="font-semibold">View Analytics</h3>
              <p className="text-sm text-zinc-400">
                Real-time RaaS metrics and Aether ROI
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Create Outcome Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Define New Outcome</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Outcome Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Deploy production MVP with payments"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Description / Success Criteria
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Landing page, auth, Stripe integration, analytics dashboard — all tests passing, deployed live."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 h-28 focus:outline-none focus:border-violet-500 transition resize-none"
                />
              </div>
              <button
                onClick={() =>
                  createOutcome.mutate({
                    title,
                    description,
                    successCriteria: description,
                    prdId: "custom",
                  })
                }
                disabled={!title || createOutcome.isPending}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-xl font-semibold transition"
              >
                {createOutcome.isPending
                  ? "Creating..."
                  : "Start Autonomous Delivery — Pay Only on Verification"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
