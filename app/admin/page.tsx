"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import AppNav from "@/app/components/AppNav";
import { Users, FileCheck, Phone, ScrollText, Shield } from "lucide-react";
import Link from "next/link";

type Tab = "outcomes" | "users" | "aether" | "audit";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("outcomes");

  const stats = trpc.admin.getStats.useQuery(undefined, { retry: false });
  const allOutcomes = trpc.admin.getAllOutcomes.useQuery(undefined, {
    enabled: activeTab === "outcomes",
    retry: false,
  });
  const allUsers = trpc.admin.getAllUsers.useQuery(undefined, {
    enabled: activeTab === "users",
    retry: false,
  });
  const allLeads = trpc.admin.getAllLeads.useQuery(undefined, {
    enabled: activeTab === "aether",
    retry: false,
  });
  const auditLogs = trpc.admin.getAuditLogs.useQuery(undefined, {
    enabled: activeTab === "audit",
    retry: false,
  });

  const bulkVerify = trpc.admin.bulkVerifyOutcomes.useMutation({
    onSuccess: () => allOutcomes.refetch(),
  });

  const s = stats.data || {
    totalUsers: 0,
    totalOutcomes: 0,
    verifiedOutcomes: 0,
    paidOutcomes: 0,
    totalRevenueCents: 0,
    totalLeads: 0,
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "outcomes", label: "All Outcomes", icon: <FileCheck className="w-4 h-4" /> },
    { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { id: "aether", label: "Aether Leads", icon: <Phone className="w-4 h-4" /> },
    { id: "audit", label: "Audit Log", icon: <ScrollText className="w-4 h-4" /> },
  ];

  // If not admin, show access denied
  if (stats.error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-zinc-400 mb-6">
            You need admin privileges to view this page.
          </p>
          <Link href="/dashboard" className="px-6 py-3 bg-violet-600 rounded-xl font-medium">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <AppNav />

      <div className="max-w-7xl mx-auto p-6 pt-10">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">Admin Panel</h1>
        <p className="text-zinc-400 mb-10">Manage all RaaS outcomes, users, and operations.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold">{s.totalUsers}</div>
            <div className="text-xs text-zinc-400">Users</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold">{s.totalOutcomes}</div>
            <div className="text-xs text-zinc-400">Outcomes</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold">{s.paidOutcomes}</div>
            <div className="text-xs text-zinc-400">Paid</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold">
              ${(s.totalRevenueCents / 100).toFixed(0)}
            </div>
            <div className="text-xs text-zinc-400">Revenue (AUD)</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          {activeTab === "outcomes" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="text-left p-4 text-zinc-400 font-medium">Title</th>
                    <th className="text-left p-4 text-zinc-400 font-medium">Status</th>
                    <th className="text-left p-4 text-zinc-400 font-medium">Amount</th>
                    <th className="text-left p-4 text-zinc-400 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {(allOutcomes.data || []).map((o) => (
                    <tr key={o.id} className="border-t border-zinc-800">
                      <td className="p-4">{o.title}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-zinc-700">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4">${((o.amount_cents || 0) / 100).toFixed(2)}</td>
                      <td className="p-4 text-zinc-400">
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {(allOutcomes.data || []).length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-zinc-500">
                        No outcomes yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "users" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="text-left p-4 text-zinc-400 font-medium">Name</th>
                    <th className="text-left p-4 text-zinc-400 font-medium">Email</th>
                    <th className="text-left p-4 text-zinc-400 font-medium">Role</th>
                    <th className="text-left p-4 text-zinc-400 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {(allUsers.data || []).map((u) => (
                    <tr key={u.id} className="border-t border-zinc-800">
                      <td className="p-4">{u.full_name}</td>
                      <td className="p-4 text-zinc-400">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          u.role === "admin" ? "bg-violet-900 text-violet-300" : "bg-zinc-700"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-400">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "aether" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="text-left p-4 text-zinc-400 font-medium">Name</th>
                    <th className="text-left p-4 text-zinc-400 font-medium">Company</th>
                    <th className="text-left p-4 text-zinc-400 font-medium">Campaign</th>
                    <th className="text-left p-4 text-zinc-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(allLeads.data || []).map((l) => (
                    <tr key={l.id} className="border-t border-zinc-800">
                      <td className="p-4">{l.name}</td>
                      <td className="p-4 text-zinc-400">{l.company}</td>
                      <td className="p-4 text-zinc-400">{l.campaign}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-zinc-700">
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(allLeads.data || []).length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-zinc-500">
                        No Aether leads yet. Launch a campaign first.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-800/50">
                  <tr>
                    <th className="text-left p-4 text-zinc-400 font-medium">Action</th>
                    <th className="text-left p-4 text-zinc-400 font-medium">By</th>
                    <th className="text-left p-4 text-zinc-400 font-medium">Target</th>
                    <th className="text-left p-4 text-zinc-400 font-medium">When</th>
                  </tr>
                </thead>
                <tbody>
                  {(auditLogs.data || []).map((log) => (
                    <tr key={log.id} className="border-t border-zinc-800">
                      <td className="p-4 font-medium">{log.action}</td>
                      <td className="p-4 text-zinc-400">{log.performed_by?.slice(0, 12)}</td>
                      <td className="p-4 text-zinc-400">
                        {log.target_type} {log.target_id?.slice(0, 8)}
                      </td>
                      <td className="p-4 text-zinc-400">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {(auditLogs.data || []).length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-zinc-500">
                        No audit logs yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
