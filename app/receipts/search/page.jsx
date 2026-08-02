// app/receipts/search/page.jsx
"use client";
import { useState } from "react";

export default function ReceiptSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function search(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/receipts/search?q=${encodeURIComponent(query)}`);
    setResults(await res.json());
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Search Your Receipt</h1>
          <p className="text-sm text-gray-600 mb-6">
            Enter your receipt number, donor name, or address to track and download your digital PDF receipt.
          </p>

          <form onSubmit={search} className="flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
              placeholder="e.g. DM-2026-000001, Name, or Address"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm font-medium text-gray-600">Searching records...</p>
          </div>
        )}

        {/* No Results State */}
        {results?.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-700 font-medium">No receipts found matching your query.</p>
            <p className="text-sm text-gray-500 mt-1">Please double-check your spelling or try searching with your full name or phone number.</p>
          </div>
        )}

        {/* Results List */}
        <div className="space-y-3">
          {results?.map((r) => (
            <div
              key={r._id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all hover:shadow-md"
            >
              <div>
                <p className="font-bold text-gray-900 text-lg">{r.name}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
                  <span className="font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                    {r.receiptNumber}
                  </span>
                  <span>·</span>
                  <span className="font-semibold text-gray-900">₹{r.amount?.toLocaleString("en-IN")}</span>
                  <span>·</span>
                  <span>{r.festivalYear}</span>
                </div>
                {r.address && <p className="text-xs text-gray-500 mt-1.5">{r.address}</p>}
              </div>

              <div>
                <a
                  className="inline-block bg-orange-50 hover:bg-orange-100 text-orange-800 font-medium text-sm px-4 py-2 rounded-xl border border-orange-200 transition-all text-center"
                  href={`/api/receipts/${r._id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}