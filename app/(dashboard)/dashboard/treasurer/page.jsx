// app/(dashboard)/dashboard/treasurer/page.jsx
"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
 
export default function TreasurerDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
 
  useEffect(() => {
    fetch("/api/dashboard/stats").then((r) => r.json()).then(setStats);
    fetch("/api/analytics").then((r) => r.json()).then(setAnalytics);
  }, []);
 
  if (!stats || !analytics) return <p className="p-6">Loading treasurer view...</p>;
 
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Treasurer Dashboard</h1>
        <div className="flex gap-2">
          <a className="border px-3 py-1.5 rounded text-sm" href="/api/reports/export?type=donations&format=xlsx">
            Download Income (Excel)
          </a>
          <a className="border px-3 py-1.5 rounded text-sm" href="/api/reports/export?type=expenses&format=xlsx">
            Download Expenses (Excel)
          </a>
        </div>
      </div>
 
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Income" value={stats.income.totalCollection} money highlight />
        <StatCard label="Total Expenses" value={stats.expense.totalExpenses} money />
        <StatCard label="Current Balance" value={stats.financial.netBalance} money highlight />
        <StatCard label="Cash in Hand" value={stats.income.cashCollection} money />
        <StatCard label="UPI Received" value={stats.income.upiCollection} money />
      </div>
 
      <div className="bg-white border rounded-xl p-4">
        <h3 className="font-semibold text-gray-700 mb-3">Expense Breakdown by Category</h3>
        <table className="w-full text-sm">
          <tbody>
            {analytics.expenseByCategory.map((c) => (
              <tr key={c._id} className="border-b">
                <td className="py-1">{c._id}</td>
                <td className="py-1 text-right font-medium">₹{c.total.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}