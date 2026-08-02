// app/dashboard/receipts/page.jsx
"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ReceiptsContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/receipts/search")
      .then((res) => res.json())
      .then((data) => {
        setReceipts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading receipts...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Receipts & Donations</h1>
      {receipts.length === 0 ? (
        <p className="text-gray-500">No receipts found.</p>
      ) : (
        <div className="space-y-3">
          {receipts.map((r) => {
            const isHighlighted = r._id === highlightId;
            return (
              <div
                key={r._id}
                className={`border rounded-xl p-4 flex justify-between items-center transition-colors ${
                  isHighlighted ? "bg-orange-50 border-orange-500 shadow-md" : "bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-800">{r.receiptNumber}</p>
                    {isHighlighted && (
                      <span className="bg-orange-700 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        Just Added
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{r.name} — <span className="text-gray-500">{r.address}</span></p>
                  <p className="text-xs text-gray-400 mt-1">
                    ₹{r.amount.toLocaleString("en-IN")} · {r.paymentMode} · Collector: {r.collectorName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/api/receipts/${r._id}/pdf`}
                    target="_blank"
                    className="bg-orange-700 text-white text-sm px-3 py-1.5 rounded font-medium hover:bg-orange-800"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ReceiptsPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading...</p>}>
      <ReceiptsContent />
    </Suspense>
  );
}