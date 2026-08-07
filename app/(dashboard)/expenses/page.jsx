// app/(dashboard)/expenses/page.jsx
"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ExpensesListPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null); // Modal state for viewing bill

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/expenses", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to fetch expenses");
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.expenses || []);
        setExpenses(list);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredExpenses = Array.isArray(expenses) 
    ? (categoryFilter === "All" ? expenses : expenses.filter(e => e.category === categoryFilter))
    : [];

  const totalAmount = filteredExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Festival Expenses Ledger</h1>
          <p className="text-sm text-gray-600 mt-1">Track and manage all operational bills, vendor charges, and payments.</p>
        </div>
        <Link
          href="/expenses/new"
          className="bg-orange-700 hover:bg-orange-800 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm text-center"
        >
          + Add New Expense
        </Link>
      </div>

      {/* Summary & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Filtered Expense</p>
          <p className="text-2xl font-bold text-orange-700 mt-0.5">₹{totalAmount.toLocaleString("en-IN")}</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Filter by Category</label>
          <select
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium shadow-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Decoration">Decoration</option>
            <option value="Sound System">Sound System</option>
            <option value="Lighting">Lighting</option>
            <option value="Flowers">Flowers</option>
            <option value="Prasad">Prasad</option>
            <option value="Food">Food</option>
            <option value="Printing">Printing</option>
            <option value="Transportation">Transportation</option>
            <option value="Electricity">Electricity</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>
      </div>

      {/* Expenses Table / List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600 text-sm">Loading expenses...</div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-700 font-medium">No expense records found.</p>
            <p className="text-sm text-gray-500 mt-1">Start by adding your first festival bill using the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="p-4">Title / Category</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Mode</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Bill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredExpenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{exp.title}</p>
                      <span className="inline-block bg-orange-50 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-orange-200 mt-1">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700 font-medium">{exp.vendor || "—"}</td>
                    <td className="p-4 text-gray-600">
                      {exp.date ? new Date(exp.date).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        exp.paymentMode === "UPI" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {exp.paymentMode || "Cash"}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-gray-900">
                      ₹{exp.amount?.toLocaleString("en-IN")}
                    </td>
                    <td className="p-4 text-center">
                      {exp.billUrl ? (
                        <button
                          onClick={() => setSelectedImage(exp.billUrl)}
                          className="inline-block text-orange-700 hover:text-orange-800 underline font-medium text-xs bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 cursor-pointer"
                        >
                          View Bill
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No bill</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bill Image Modal Popup */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 shadow-2xl relative flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-3 border-b pb-2">
              <h3 className="font-bold text-gray-900 text-base">Expense Bill Receipt</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-800 font-bold text-lg px-2 py-1 rounded-lg bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto w-full flex justify-center bg-gray-100 rounded-xl p-2">
              <img
                src={selectedImage}
                alt="Bill Receipt"
                className="max-h-[70vh] object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}