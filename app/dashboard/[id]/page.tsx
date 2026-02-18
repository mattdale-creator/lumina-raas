"use client";

import React from "react";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc-client";
import AppNav from "@/app/components/AppNav";
import {
  ArrowLeft,
  Brain,
  Building,
  Code,
  TestTube,
  Rocket,
  Check,
  Clock,
} from "lucide-react";
import Link from "next/link";

const agentIcons: Record<string, React.ReactNode> = {
  analyst: <Brain className="w-5 h-5 text-violet-400" />,
  architect: <Building className="w-5 h-5 text-blue-400" />,
  engineer: <Code className="w-5 h-5 text-emerald-400" />,
  tester: <TestTube className="w-5 h-5 text-yellow-400" />,
  deployer: <Rocket className="w-5 h-5 text-pink-400" />,
};

const agentLabels: Record<string, string> = {
  analyst: "Requirements Analyst",
  architect: "System Architect",
  engineer: "Full-Stack Engineer",
  tester: "QA Engineer",
  deployer: "DevOps & Deployment",
};

const statusColors: Record<string, string> = {
  pending: "bg-zinc-700 text-zinc-300",
  in_progress: "bg-blue-900 text-blue-300",
  delivered: "bg-violet-900 text-violet-300",
  verified: "bg-emerald-900 text-emerald-300",
  paid: "bg-green-900 text-green-300",
};

export default function OutcomeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const outcome = trpc.outcome.getById.useQuery({ id }, { retry: false });
  const verify = trpc.outcome.verify.useMutation({
    onSuccess: () => outcome.refetch(),
  });

  if (outcome.isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <AppNav />
        <div className="max-w-4xl mx-auto p-6 pt-10 text-center text-zinc-500">
          Loading outcome...
        </div>
      </div>
    );
  }

  if (outcome.error || !outcome.data) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <AppNav />
        <div className="max-w-4xl mx-auto p-6 pt-10 text-center">
          <p className="text-zinc-400 mb-4">Outcome not found or access denied.</p>
          <Link href="/dashboard" className="text-violet-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const data = outcome.data;
  const agents = data.agents || [];
  const prdLogs = data.prdInstance?.logs
    ? typeof data.prdInstance.logs === "string"
      ? JSON.parse(data.prdInstance.logs)
      : data.prdInstance.logs
    : null;

  return (
    <div className="min-h-screen bg-zinc-950">
      <AppNav />

      <div className="max-w-4xl mx-auto p-6 pt-10">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">{data.title}</h1>
            {data.description && (
              <p className="text-zinc-400 mt-2">{data.description}</p>
            )}
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium self-start ${
              statusColors[data.status] || "bg-zinc-700"
            }`}
          >
            {data.status.replace("_", " ")}
          </span>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mb-8">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> Created:{" "}
            {new Date(data.created_at).toLocaleString()}
          </span>
          {data.delivered_at && (
            <span className="text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Delivered:{" "}
              {new Date(data.delivered_at).toLocaleString()}
            </span>
          )}
          {data.verified_at && (
            <span className="text-green-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Verified:{" "}
              {new Date(data.verified_at).toLocaleString()}
            </span>
          )}
        </div>

        {/* Verify Button */}
        {data.status === "delivered" && (
          <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-2xl p-6 mb-8 text-center">
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">
              Outcome Delivered — Ready for Verification
            </h3>
            <p className="text-zinc-400 text-sm mb-4">
              Review the agent outputs below. If you&apos;re satisfied, verify to
              confirm delivery.
            </p>
            <button
              onClick={() => verify.mutate({ outcomeId: data.id })}
              disabled={verify.isPending}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold transition"
            >
              {verify.isPending ? "Verifying..." : "✓ Verify Outcome — Confirm Delivery"}
            </button>
          </div>
        )}

        {data.status === "verified" && (
          <div className="bg-green-900/30 border border-green-500/50 rounded-2xl p-6 mb-8 text-center">
            <h3 className="text-lg font-semibold text-green-400">
              ✅ Outcome Verified Successfully
            </h3>
            <p className="text-zinc-400 text-sm mt-2">
              This outcome has been verified and confirmed.
            </p>
          </div>
        )}

        {/* Agent Outputs */}
        <h2 className="text-2xl font-bold mb-6">Agent Pipeline Output</h2>

        {agents.length === 0 && (
          <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <p className="text-zinc-500">
              {data.status === "pending"
                ? "Agents are being activated... refresh in a moment."
                : data.status === "in_progress"
                ? "Agents are processing this outcome now..."
                : "No agent data available."}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {agents.map((agent: { id: string; agent_role: string; iteration_count: number; last_status: string; completed: boolean }, i: number) => (
            <details
              key={agent.id}
              className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
              open={i === 0}
            >
              <summary className="flex items-center gap-4 p-6 cursor-pointer hover:bg-zinc-800/50 transition">
                <div className="flex items-center gap-3 flex-1">
                  {agentIcons[agent.agent_role] || (
                    <Brain className="w-5 h-5 text-zinc-400" />
                  )}
                  <div>
                    <h3 className="font-semibold">
                      {agentLabels[agent.agent_role] || agent.agent_role}
                    </h3>
                    <span className="text-xs text-zinc-500">
                      {agent.iteration_count} iteration(s)
                    </span>
                  </div>
                </div>
                <span className="text-emerald-400 text-xs">
                  {agent.completed ? "✓ Complete" : "⏳ Running"}
                </span>
                <span className="text-xl group-open:rotate-180 transition-transform text-zinc-500">
                  ↓
                </span>
              </summary>
              <div className="px-6 pb-6 border-t border-zinc-800">
                <pre className="mt-4 text-sm text-zinc-300 whitespace-pre-wrap font-mono bg-zinc-800/50 p-4 rounded-xl overflow-x-auto max-h-96 overflow-y-auto">
                  {agent.last_status}
                </pre>
              </div>
            </details>
          ))}
        </div>

        {/* Full PRD Logs (if available) */}
        {prdLogs && typeof prdLogs === "object" && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Full Delivery Report</h2>
            {Object.entries(prdLogs).map(([key, value]) => (
              <details
                key={key}
                className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-4"
              >
                <summary className="flex items-center gap-4 p-6 cursor-pointer hover:bg-zinc-800/50 transition">
                  <h3 className="font-semibold capitalize flex-1">{key}</h3>
                  <span className="text-xl group-open:rotate-180 transition-transform text-zinc-500">
                    ↓
                  </span>
                </summary>
                <div className="px-6 pb-6 border-t border-zinc-800">
                  <pre className="mt-4 text-sm text-zinc-300 whitespace-pre-wrap font-mono bg-zinc-800/50 p-4 rounded-xl overflow-x-auto max-h-[600px] overflow-y-auto">
                    {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
                  </pre>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
