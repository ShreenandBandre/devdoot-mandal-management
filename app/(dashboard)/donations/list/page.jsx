// app/donations/list/page.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DonationsListPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/donations", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        // Safe check: ensure we extract the array properly
        const list = Array.isArray(data) ? data : (data.donations || data.items || []);
        setDonations(list);
      })
      .catch((err) => {
        console.error("Failed to fetch donations", err);
        setDonations([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredDonations = Array.isArray(donations)
    ? donations.filter((d) =>
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.receiptNumber?.toLowerCase().includes(search.toLowerCase()) ||
        d.phone?.includes(search)
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donation Receipts Ledger</h1>
          <p className="text-sm text-gray-600 mt-1">View all issued digital receipts and donor records.</p>
        </div>
        <Link
          href="/donations/new"
          className="bg-orange-700 hover:bg-orange-800 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm text-center w-full sm:w-auto"
        >
          + New Donation Entry
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <input
          type="text"
          placeholder="Search by donor name, receipt number, or phone..."
          className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List / Table Content */}
      <div className="bg-white sm:bg-transparent sm:border-none rounded-2xl sm:rounded-none border border-gray-200 shadow-sm sm:shadow-none overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600 text-sm bg-white rounded-2xl border border-gray-200">Loading donations...</div>
        ) : filteredDonations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-700 font-medium">No donation records found.</p>
            {search && <p className="text-sm text-gray-500 mt-1">Try adjusting your search query.</p>}
          </div>
        ) : (
          <>
            {/* ============================================================
                DESKTOP TABLE VIEW (Hidden on mobile < 640px)
                ============================================================ */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="p-4">Receipt No. & Date</th>
                    <th className="p-4">Donor Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-sm">
                  {filteredDonations.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 align-top">
                        <span className="font-semibold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 text-xs">
                          {d.receiptNumber}
                        </span>
                        <p className="text-xs text-gray-500 mt-1.5">
                          {d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-IN") : "—"}
                        </p>
                      </td>
                      <td className="p-4 font-bold text-gray-900 align-top">{d.name}</td>
                      <td className="p-4 text-gray-600 align-top">{d.phone || "—"}</td>
                      <td className="p-4 text-right font-bold text-gray-900 align-top">
                        ₹{d.amount?.toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 text-center align-top">
                        <a
                          href={`/api/receipts/${d._id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-orange-700 hover:text-orange-800 underline font-medium text-xs bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors"
                        >
                          Download PDF
                        </a>
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
              {filteredDonations.map((d) => (
                <div key={d._id} className="p-4 space-y-3 hover:bg-gray-50">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-bold text-gray-900 text-base">{d.name}</p>
                      <p className="text-sm text-gray-600">{d.phone || "No Phone"}</p>
                      <div className="mt-1.5">
                        <span className="font-semibold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 text-xs">
                          {d.receiptNumber}
                        </span>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900 text-lg whitespace-nowrap">
                      ₹{d.amount?.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex justify-between items-center gap-3 pt-2 border-t border-gray-100 text-sm">
                    <span className="text-gray-600">
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-IN") : "—"}
                    </span>
                    <a
                      href={`/api/receipts/${d._id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-700 hover:text-orange-800 underline font-medium text-sm cursor-pointer py-1"
                    >
                      Download PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}