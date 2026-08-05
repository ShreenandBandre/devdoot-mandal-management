// app/page.jsx
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import Expense from "@/lib/models/Expense";

// Make the homepage dynamic to fetch real-time total collection numbers
export const dynamic = "force-dynamic";

async function getPublicStats() {
  try {
    await connectDB();
    const donationFilter = { isDeleted: false };
    const expenseFilter = { isDeleted: false };

    const sum = (arr) => arr[0]?.total || 0;

    const [totalCollection, totalExpenses, totalReceipts] = await Promise.all([
      Donation.aggregate([
        { $match: donationFilter },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then(sum),
      Expense.aggregate([
        { $match: expenseFilter },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]).then(sum),
      Donation.countDocuments(donationFilter),
    ]);

    return {
      totalCollection,
      netBalance: totalCollection - totalExpenses,
      totalReceipts,
    };
  } catch (err) {
    console.error("Public stats error:", err);
    return { totalCollection: 0, netBalance: 0, totalReceipts: 0 };
  }
}

export default async function HomePage() {
  const stats = await getPublicStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-50 text-stone-800 flex flex-col justify-between">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-amber-700 via-orange-800 to-amber-900 text-white py-20 px-4 shadow-xl">
        {/* Subtle decorative background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.15),transparent_50%)] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-600/40 border border-amber-400/30 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm">
            ✨ Ganpati Festival {new Date().getFullYear()}
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Devdoot Mandal
          </h1>
          
          <p className="max-w-xl mx-auto text-amber-100/90 text-base sm:text-lg font-medium leading-relaxed">
            Welcome to our digital portal. Celebrating community devotion with complete financial transparency and instant digital receipts.
          </p>

          {/* Live Total Collection Highlight Box inside Hero */}
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-inner text-white my-6">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-200">Total Public Collections</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1 tracking-tight text-amber-100">
              ₹{stats.totalCollection.toLocaleString("en-IN")}
            </p>
            <div className="mt-3 flex justify-center gap-6 text-xs text-amber-100/80 border-t border-white/10 pt-3">
              <span>Receipts: <strong>{stats.totalReceipts}</strong></span>
              <span>Net Balance: <strong>₹{stats.netBalance.toLocaleString("en-IN")}</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap gap-4 justify-center items-center">
            <Link
              href="/receipts/search"
              className="bg-white hover:bg-amber-50 text-amber-900 font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl text-sm transform hover:-translate-y-0.5"
            >
              🔍 Find My Receipt
            </Link>
            
            <Link
              href="/login"
              className="bg-amber-600/60 hover:bg-amber-600 border border-amber-300/40 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md backdrop-blur-sm text-sm"
            >
              🔐 Portal Login
            </Link>

            <Link
              href="/donations/list"
              className="border border-white/40 hover:bg-white/10 text-white font-medium px-6 py-3 rounded-xl transition-all text-sm backdrop-blur-sm"
            >
              📋 View Collections
            </Link>

            <Link
              href="/expenses"
              className="border border-white/40 hover:bg-white/10 text-white font-medium px-6 py-3 rounded-xl transition-all text-sm backdrop-blur-sm"
            >
              📝 View Expenses
            </Link>
          </div>
        </div>
      </header>

      {/* Info Cards Section */}
      <main className="max-w-5xl mx-auto py-16 px-6 w-full">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-800">Our Core Values</h2>
          <h3 className="text-2xl font-bold text-stone-900">Transparency & Devotion</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <InfoCard 
            icon="📊" 
            title="Transparent Accounts" 
            text="Every donation contribution and operational expense is securely logged and open for public verification." 
          />
          <InfoCard 
            icon="⚡" 
            title="Instant Digital Receipt" 
            text="Generate and download secure PDF receipts embedded with unique QR verification tags instantly." 
          />
          <InfoCard 
            icon="📱" 
            title="Common UPI QR" 
            text="Scan once to contribute directly through secure digital gateways without cash hassles." 
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-500 bg-white">
        <p>© {new Date().getFullYear()} Devdoot Mandal. All rights reserved.</p>
      </footer>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="text-3xl mb-4 bg-amber-50 w-12 h-12 rounded-xl flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-stone-900 text-base">{title}</h3>
      <p className="text-sm text-stone-600 mt-2 leading-relaxed">{text}</p>
    </div>
  );
}