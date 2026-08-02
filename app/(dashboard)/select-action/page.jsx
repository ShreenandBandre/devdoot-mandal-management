// app/(dashboard)/select-action/page.jsx
"use client";
import Link from "next/link";

export default function SelectActionPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div>
          <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-orange-200">
            Devdoot Mandal Portal
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-3">What would you like to do?</h1>
          <p className="text-sm text-gray-600 mt-1">Choose an action below to record entries for the festival.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          {/* Add Donation Card */}
          <Link
            href="/donations/new"
            className="group bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-orange-500 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-orange-50 text-orange-700 rounded-xl flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform border border-orange-200">
                💵
              </div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                Add Donation
              </h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Record new devotee contributions, cash, or UPI payments and generate digital receipts.
              </p>
            </div>
            <div className="mt-6 text-sm font-semibold text-orange-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Proceed to entry →
            </div>
          </Link>

          {/* Add Expense Card */}
          <Link
            href="/expenses/new"
            className="group bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-orange-500 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-orange-50 text-orange-700 rounded-xl flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform border border-orange-200">
                📝
              </div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                Add Expense
              </h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Log operational bills, vendor charges, decoration costs, and upload payment proofs.
              </p>
            </div>
            <div className="mt-6 text-sm font-semibold text-orange-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Proceed to bill entry →
            </div>
          </Link>
        </div>

        <div className="pt-4">
          <Link
            href="/donations/list"
            className="text-xs font-medium text-gray-500 hover:text-orange-700 underline"
          >
            View all collections list directly →
          </Link>
        </div>
      </div>
    </div>
  );
}