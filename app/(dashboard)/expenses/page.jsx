// app/(dashboard)/expenses/page.jsx
"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ExpensesListPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

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

  // Reusable component for Payment Mode Badge
  const PaymentBadge = ({ mode }) => (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      mode === "UPI" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
    }`}>
      {mode || "Cash"}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses Ledger</h1>
          <p className="text-sm text-gray-600 mt-1">Manage operational bills and payments.</p>
        </div>
        <Link
          href="/expenses/new"
          className="bg-orange-700 hover:bg-orange-800 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm text-center w-full sm:w-auto"
        >
          + Add Expense
        </Link>
      </div>

      {/* Summary & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 xs:grid-cols-2 gap-4 items-end">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Expense</p>
          <p className="text-2xl font-bold text-orange-700 mt-0.5">₹{totalAmount.toLocaleString("en-IN")}</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Filter Category</label>
          <select
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium shadow-sm w-full"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Decoration">Decoration</option>
            <option value="Sound System">Sound System</option>
            <option value="Lighting">Lighting</option>
            <option value="Prasad">Prasad</option>
            <option value="Food">Food</option>
            <option value="Miscellaneous">Misc</option>
          </select>
        </div>
      </div>

      {/* Expenses Content */}
      <div className="bg-white sm:bg-transparent sm:border-none rounded-2xl sm:rounded-none border border-gray-200 shadow-sm sm:shadow-none overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600 text-sm bg-white rounded-2xl border border-gray-200">Loading expenses...</div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-700 font-medium">No expense records found.</p>
          </div>
        ) : (
          <>
            {/* ============================================================
                DESKTOP TABLE VIEW (Hidden on mobile < 640px)
                ============================================================ */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="p-4">Title / Category</th>
                    <th className="p-4">Vendor</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Mode</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4 text-center">Bill</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-sm">
                  {filteredExpenses.map((exp) => (
                    <tr key={exp._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 align-top">
                        <p className="font-bold text-gray-900">{exp.title}</p>
                        <span className="inline-block bg-orange-50 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-orange-200 mt-1">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700 font-medium align-top">{exp.vendor || "—"}</td>
                      <td className="p-4 text-gray-600 align-top">
                        {exp.date ? new Date(exp.date).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td className="p-4 align-top">
                        <PaymentBadge mode={exp.paymentMode} />
                      </td>
                      <td className="p-4 text-right font-bold text-gray-900 align-top">
                        ₹{exp.amount?.toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 text-center align-top">
                        {exp.billUrl ? (
                          <button
                            onClick={() => setSelectedImage(exp.billUrl)}
                            className="text-orange-700 hover:text-orange-800 underline font-medium text-xs bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 cursor-pointer"
                          >
                            View
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

            {/* ============================================================
                MOBILE CARD VIEW (Visible only on mobile < 640px)
                ============================================================ */}
            <div className="sm:hidden divide-y divide-gray-200 bg-white">
              {filteredExpenses.map((exp) => (
                <div key={exp._id} className="p-4 space-y-3 hover:bg-gray-50">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-bold text-gray-900 text-base">{exp.title}</p>
                      <p className="text-sm text-gray-600">{exp.vendor || "No Vendor"}</p>
                      <span className="inline-block bg-orange-50 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-orange-200 mt-1.5">
                        {exp.category}
                      </span>
                    </div>
                    <p className="font-bold text-gray-900 text-lg whitespace-nowrap">
                      ₹{exp.amount?.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex justify-between items-center gap-3 pt-2 border-t border-gray-100 text-sm">
                    <div className="flex items-center gap-3 text-gray-600">
                      <PaymentBadge mode={exp.paymentMode} />
                      <span>
                        {exp.date ? new Date(exp.date).toLocaleDateString("en-IN") : "—"}
                      </span>
                    </div>
                    
                    <div>
                      {exp.billUrl ? (
                        <button
                          onClick={() => setSelectedImage(exp.billUrl)}
                          className="text-orange-700 hover:text-orange-800 underline font-medium text-sm cursor-pointer py-1"
                        >
                          View Bill
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic py-1">No bill</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bill Image Modal Popup (Remains same) */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 shadow-2xl relative flex flex-col items-center animate-scaleIn">
            <div className="w-full flex justify-between items-center mb-3 border-b pb-2">
              <h3 className="font-bold text-gray-900 text-base">Expense Bill Receipt</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-800 font-bold text-lg px-2 py-1 rounded-lg bg-gray-100 transition-colors"
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
      
      {/* Add simple CSS for animations if not using Tailwind config animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}