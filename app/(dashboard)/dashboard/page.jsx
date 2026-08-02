// app/dashboard/page.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard/stats").then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-gray-700">Loading financial overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8 text-gray-900">
        {/* Top Banner & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-sm text-gray-600 mt-1">Real-time financial summary and contribution statistics.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/donations/new"
              className="bg-orange-700 hover:bg-orange-800 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm text-center"
            >
              + New Donation
            </Link>
            <Link
              href="/dashboard/expenses/new"
              className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 font-medium px-4 py-2.5 rounded-xl transition-all text-sm text-center shadow-sm"
            >
              + Add Expense
            </Link>
          </div>
        </div>

        {/* Income Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Income & Collections
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Today's Collection" value={stats.income.todayCollection} money />
            <StatCard label="Weekly Collection" value={stats.income.weekCollection} money />
            <StatCard label="Monthly Collection" value={stats.income.monthCollection} money />
            <StatCard label="Total Collection" value={stats.income.totalCollection} money highlight />
            <StatCard label="Cash Collection" value={stats.income.cashCollection} money />
            <StatCard label="UPI Collection" value={stats.income.upiCollection} money />
            <StatCard label="Total Receipts" value={stats.income.totalReceipts} />
          </div>
        </section>

        {/* Expenses Section */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Operational Expenses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Today's Expenses" value={stats.expense.todayExpenses} money />
            <StatCard label="Monthly Expenses" value={stats.expense.monthExpenses} money />
            <StatCard label="Total Expenses" value={stats.expense.totalExpenses} money />
          </div>
        </section>

        {/* Financial Section */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span> Financial Balance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Net Balance" value={stats.financial.netBalance} money highlight />
          </div>
        </section>

        {/* Other Insights Section */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Insights & Community
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total Volunteers" value={stats.other.volunteerCount} />
            <StatCard label="Average Donation" value={stats.other.avgDonation} money />
            <StatCard
              label="Highest Donation"
              value={stats.other.topDonation?.amount || 0}
              money
              sub={stats.other.topDonation?.name}
            />
          </div>
        </section>
      </div>
    </div>
  );
}