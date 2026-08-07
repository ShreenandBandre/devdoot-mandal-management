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
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 text-stone-900 flex flex-col justify-between">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-amber-700 via-orange-800 to-amber-950 text-white py-20 px-4 shadow-2xl">
        {/* Subtle decorative background glow & patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.2),transparent_50%)] pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Marathi Festival Tag */}
          <div className="inline-flex items-center gap-2 bg-amber-500/30 border border-amber-300/40 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase backdrop-blur-md shadow-sm text-amber-200">
            ✨ गणपती बाप्पा मोरया • गणेश उत्सव {new Date().getFullYear()} ✨
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-sm font-sans">
            देवदूत गणेश मित्र मंडळ
          </h1>
          <p className="text-lg sm:text-xl font-medium text-amber-200/90 tracking-wide">
            Devdoot Ganesh Mitra Mandal
          </p>

          <p className="max-w-xl mx-auto text-amber-100/90 text-sm sm:text-base font-normal leading-relaxed">
            संपूर्ण पारदर्शक आणि डिजिटल देणगी व्यवस्थापन प्रणाली. Welcome to our digital portal celebrating devotion with complete transparency.
          </p>

          {/* Live Total Collection Highlight Box */}
          <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-xl border border-white/25 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8 transform hover:scale-[1.01] transition-transform">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-300">Total Public Collections / एकूण संग्रह</p>
            <p className="text-4xl sm:text-5xl font-black mt-2 tracking-tight text-amber-100 drop-shadow">
              ₹{stats.totalCollection.toLocaleString("en-IN")}
            </p>

            {/* Increased Size & Prominent Receipt Count and Net Balance */}
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-5 text-center">
              <div className="bg-black/20 p-3 rounded-2xl border border-white/10">
                <p className="text-xs text-amber-200 uppercase font-semibold">Total Receipts</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{stats.totalReceipts}</p>
              </div>
              <div className="bg-black/20 p-3 rounded-2xl border border-white/10">
                <p className="text-xs text-amber-200 uppercase font-semibold">Net Balance (In Hand)</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-300 mt-1">₹{stats.netBalance.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Enhanced and Styled */}
          <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
            <Link
              href="/receipts/search"
              className="bg-white hover:bg-amber-50 text-amber-950 font-bold px-6 py-3.5 rounded-2xl transition-all shadow-xl hover:shadow-amber-500/20 text-sm transform hover:-translate-y-0.5 active:translate-y-0"
            >
              🔍 Find My Receipt / पावती शोधा
            </Link>

            <Link
              href="/donations/list"
              className="bg-amber-600/70 hover:bg-amber-600 border border-amber-300/40 text-white font-semibold px-6 py-3.5 rounded-2xl transition-all shadow-lg backdrop-blur-md text-sm transform hover:-translate-y-0.5"
            >
              📋 View Collections / देणगी सूची
            </Link>

            <Link
              href="/expenses"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3.5 rounded-2xl transition-all text-sm backdrop-blur-md shadow-sm"
            >
              📝 View Expenses / खर्च पहा
            </Link>

            <Link
              href="/login"
              className="bg-stone-900/60 hover:bg-stone-900 border border-stone-700 text-amber-200 font-semibold px-6 py-3.5 rounded-2xl transition-all text-sm backdrop-blur-md shadow-sm"
            >
              🔐 Portal Login
            </Link>
          </div>
        </div>
      </header>

      {/* Info Cards Section */}
      <main className="max-w-5xl mx-auto py-16 px-6 w-full">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700">आमची वैशिष्ट्ये & Core Values</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Transparency & Devotion</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <InfoCard 
            icon="📊" 
            title="पारदर्शक हिशोब (Transparent)" 
            text="Every contribution and operational expense is securely logged and open for public verification anytime." 
          />
          <InfoCard 
            icon="⚡" 
            title="त्वरित डिजिटल पावती (Instant PDF)" 
            text="Generate and download secure PDF receipts embedded with unique QR verification tags instantly." 
          />
          <InfoCard 
            icon="📱" 
            title="सुरक्षित युपीआय (UPI Ready)" 
            text="Scan once to contribute directly through secure digital gateways without cash or paper hassles." 
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-600 bg-white shadow-inner">
        <p className="font-medium">© {new Date().getFullYear()} Devdoot Ganesh Mitra Mandal (देवदूत गणेश मित्र मंडळ). All rights reserved.</p>
      </footer>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="bg-white border border-amber-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all group duration-300">
      <div className="text-3xl mb-4 bg-amber-50 w-14 h-14 rounded-2xl flex items-center justify-center border border-amber-200 group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <h3 className="font-bold text-stone-900 text-lg">{title}</h3>
      <p className="text-sm text-stone-600 mt-2 leading-relaxed">{text}</p>
    </div>
  );
}