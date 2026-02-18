"use client";

import React from "react";
import { trpc } from "@/lib/trpc-client";
import AppNav from "@/app/components/AppNav";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download, BarChart3, TrendingUp, DollarSign } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  const metrics = trpc.analytics.getMyMetrics.useQuery();
  const deliveryStats = trpc.analytics.getDeliveryStats.useQuery(undefined, {
    retry: false,
  });

  const m = metrics.data || { total: 0, delivered: 0, verified: 0, paid: 0 };
  const chartData = (deliveryStats.data || [])
    .filter((d) => d.deliveryMinutes !== null)
    .map((d) => ({
      name: d.title?.slice(0, 15) || d.id.slice(0, 8),
      minutes: d.deliveryMinutes,
      amount: (d.amountCents || 0) / 100,
    }));

  return (
    <div className="min-h-screen bg-zinc-950">
      <AppNav />

      <div className="max-w-7xl mx-auto p-6 pt-10">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">
          RaaS Analytics
        </h1>
        <p className="text-zinc-400 mb-10">
          Measure every delivered outcome. Privacy-first, real-time.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <BarChart3 className="w-5 h-5 text-violet-400 mb-3" />
            <div className="text-3xl font-bold">{m.total}</div>
            <div className="text-sm text-zinc-400">Total Outcomes</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <TrendingUp className="w-5 h-5 text-blue-400 mb-3" />
            <div className="text-3xl font-bold">{m.delivered}</div>
            <div className="text-sm text-zinc-400">Delivered</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <DollarSign className="w-5 h-5 text-emerald-400 mb-3" />
            <div className="text-3xl font-bold">{m.verified}</div>
            <div className="text-sm text-zinc-400">Verified</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <DollarSign className="w-5 h-5 text-green-400 mb-3" />
            <div className="text-3xl font-bold">{m.paid}</div>
            <div className="text-sm text-zinc-400">Paid</div>
          </div>
        </div>

        {/* Chart */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-6">
              Outcome Delivery Time (minutes)
            </h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="minutes" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-zinc-500">
                No delivery data yet. Create and deliver outcomes to see charts.
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-6">Outcome Value (AUD)</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-zinc-500">
                No value data yet.
              </div>
            )}
          </div>
        </div>

        {/* Export */}
        <div className="flex justify-center">
          <a
            href="/api/analytics/export"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-medium transition"
          >
            <Download className="w-4 h-4" /> Export All RaaS Metrics (CSV)
          </a>
        </div>
      </div>
    </div>
  );
}
