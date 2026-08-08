```jsx
// app/page.jsx
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import Expense from "@/lib/models/Expense";

export const dynamic = "force-dynamic";

async function getPublicStats() {
  try {
    await connectDB();

    const donationFilter = { isDeleted: false };
    const expenseFilter = { isDeleted: false };

    const sum = (arr) => arr[0]?.total || 0;

    const [totalCollection, totalExpenses, totalReceipts] =
      await Promise.all([
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

    return {
      totalCollection: 0,
      netBalance: 0,
      totalReceipts: 0,
    };
  }
}

export default async function HomePage() {
  const stats = await getPublicStats();
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7c2d12] via-[#8f3b18] to-[#fffaf0] text-stone-900">

      {/* ================= HERO ================= */}
      <header className="relative overflow-hidden text-white">

        {/* Soft background glow */}
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-orange-300/10 blur-3xl" />
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-red-900/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20">

          {/* Festival Badge */}
          <div className="mb-7 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/10 px-5 py-2 text-xs font-bold tracking-widest text-amber-100 shadow-lg backdrop-blur-md">
              ✨ गणपती बाप्पा मोरया
              <span className="text-amber-300">•</span>
              गणेश उत्सव {year}
              ✨
            </div>
          </div>

          {/* Title */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-black tracking-tight drop-shadow-lg sm:text-6xl">
              देवदूत गणेश मित्र मंडळ
            </h1>

            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-200 sm:text-base">
              Devdoot Ganesh Mitra Mandal
            </p>

            <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-amber-50/90 sm:text-base">
              संपूर्ण पारदर्शक आणि डिजिटल देणगी व्यवस्थापन प्रणाली.
              <br className="hidden sm:block" />
              Welcome to our digital portal celebrating devotion with complete
              transparency.
            </p>
          </div>

          {/* ================= STATS CARD ================= */}
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="group rounded-[2rem] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl transition duration-300 hover:bg-white/[0.13] sm:p-7">

              <div className="rounded-[1.5rem] border border-amber-200/10 bg-black/10 px-5 py-6 text-center sm:px-8">

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300 sm:text-xs">
                  Total Public Collections
                </p>

                <p className="mt-1 text-[11px] text-amber-100/60">
                  एकूण सार्वजनिक संग्रह
                </p>

                <p className="mt-2 text-4xl font-black tracking-tight text-white drop-shadow sm:text-5xl">
                  ₹{stats.totalCollection.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Secondary stats */}
              <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-white/10 bg-black/15 p-4 text-center transition hover:bg-black/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-200/70">
                    Total Receipts
                  </p>

                  <p className="mt-1 text-2xl font-black text-white sm:text-3xl">
                    {stats.totalReceipts.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-300/10 bg-emerald-500/10 p-4 text-center transition hover:bg-emerald-500/15">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80">
                    Net Balance
                  </p>

                  <p className="mt-1 text-2xl font-black text-emerald-300 sm:text-3xl">
                    ₹{stats.netBalance.toLocaleString("en-IN")}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">

            <Link
              href="/receipts/search"
              className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#7c2d12] shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-xl"
            >
              🔍 Find My Receipt
              <span className="ml-1 text-xs font-medium opacity-60">
                / पावती शोधा
              </span>
            </Link>

            <Link
              href="/donations/list"
              className="rounded-xl border border-amber-300/40 bg-amber-500/70 px-5 py-3 text-sm font-semibold text-white shadow-md backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-amber-500"
            >
              📋 Collections
              <span className="ml-1 text-xs opacity-70">
                / देणगी
              </span>
            </Link>

            <Link
              href="/expenses"
              className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/15"
            >
              📝 Expenses
              <span className="ml-1 text-xs opacity-70">
                / खर्च
              </span>
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-white/15 bg-black/20 px-5 py-3 text-sm font-semibold text-amber-100 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-black/30"
            >
              🔐 Portal Login
            </Link>

          </div>
        </div>
      </header>

      {/* ================= FEATURES ================= */}
      <main className="relative bg-[#fffaf0] px-5 py-16 sm:px-6">

        <div className="mx-auto max-w-5xl">

          {/* Heading */}
          <div className="mb-10 text-center">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              आमची वैशिष्ट्ये
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
              Transparency & Devotion
            </h2>

            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-amber-600" />

          </div>

          {/* Cards */}
          <div className="grid gap-5 md:grid-cols-3">

            <InfoCard
              icon="📊"
              title="पारदर्शक हिशोब"
              subtitle="Transparent"
              text="Every contribution and operational expense is securely logged and open for public verification anytime."
            />

            <InfoCard
              icon="⚡"
              title="त्वरित डिजिटल पावती"
              subtitle="Instant PDF"
              text="Generate and download secure PDF receipts with unique QR verification tags instantly."
            />

            <InfoCard
              icon="📱"
              title="सुरक्षित UPI"
              subtitle="UPI Ready"
              text="Scan once to contribute directly through secure digital gateways without cash or paper hassles."
            />

          </div>

          {/* Small trust line */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-stone-400">
            <span>✓ Transparent Records</span>
            <span>•</span>
            <span>✓ Digital Receipts</span>
            <span>•</span>
            <span>✓ Public Verification</span>
          </div>

        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-stone-200 bg-white px-5 py-6 text-center">

        <p className="text-xs font-medium text-stone-500">
          © {year} Devdoot Ganesh Mitra Mandal
        </p>

        <p className="mt-1 text-[10px] tracking-wide text-stone-400">
          देवदूत गणेश मित्र मंडळ • श्रद्धा • सेवा • पारदर्शकता
        </p>

      </footer>
    </div>
  );
}

/* ================= INFO CARD ================= */

function InfoCard({
  icon,
  title,
  subtitle,
  text,
}) {
  return (
    <div className="group rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-xl transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-extrabold text-stone-900">
        {title}
      </h3>

      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">
        {subtitle}
      </p>

      <p className="mt-3 text-sm leading-6 text-stone-500">
        {text}
      </p>

      <div className="mt-5 h-px w-8 bg-amber-400 transition-all duration-300 group-hover:w-14" />

    </div>
  );
}
```
