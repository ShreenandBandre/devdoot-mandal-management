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
    <div className="min-h-screen bg-[#fbf7ef] text-[#2d1b12] overflow-hidden">
      {/* =========================================================
          GLOBAL DECORATIVE BACKGROUND
      ========================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-200/25 blur-3xl" />
        <div className="absolute top-[35%] -right-48 h-[500px] w-[500px] rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute bottom-0 left-[30%] h-[400px] w-[400px] rounded-full bg-red-100/20 blur-3xl" />

        {/* Fine traditional pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, #7c2d12 1px, transparent 0)
            `,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* =========================================================
          HERO
      ========================================================== */}

      <header className="relative">
        {/* Top traditional strip */}
        <div className="h-1.5 bg-gradient-to-r from-[#7f1d1d] via-[#ea580c] to-[#7f1d1d]" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-7 pb-20">
          {/* Navigation / Brand */}
          <nav className="flex items-center justify-between mb-14">
            <Link
              href="/"
              className="group flex items-center gap-3"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#8f1d14] text-white shadow-lg shadow-red-900/20">
                <span className="text-xl">ॐ</span>

                <span className="absolute inset-[-4px] rounded-full border border-[#d97706]/40" />
              </div>

              <div>
                <p className="text-sm font-bold tracking-wide text-[#7f1d1d]">
                  देवदूत
                </p>
                <p className="text-[10px] tracking-[0.24em] uppercase text-[#92400e]/70">
                  Ganesh Mitra Mandal
                </p>
              </div>
            </Link>

            <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#d6b36a]/40 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
              <span className="text-xs font-semibold text-stone-600">
                Live Public Accounts
              </span>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="relative grid lg:grid-cols-[1fr_460px] gap-14 items-center">
            {/* Left */}
            <div className="relative z-10 text-center lg:text-left">
              {/* Festival Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d6a64f]/50 bg-[#fffaf0]/90 px-5 py-2 text-[11px] font-bold tracking-[0.16em] text-[#92400e] shadow-sm">
                <span>✦</span>
                <span>गणपती बाप्पा मोरया</span>
                <span className="text-[#c2410c]">•</span>
                <span>गणेश उत्सव {year}</span>
                <span>✦</span>
              </div>

              <h1 className="mt-7 text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.02] tracking-[-0.04em] text-[#461a0b]">
                देवदूत गणेश
                <span className="block text-[#a52a16]">
                  मित्र मंडळ
                </span>
              </h1>

              <div className="mt-5 flex items-center justify-center lg:justify-start gap-3">
                <span className="h-px w-10 bg-[#d6a64f]" />

                <p className="text-sm sm:text-base font-semibold tracking-[0.22em] uppercase text-[#9a3412]">
                  Devdoot Ganesh Mitra Mandal
                </p>

                <span className="h-px w-10 bg-[#d6a64f]" />
              </div>

              <p className="max-w-xl mx-auto lg:mx-0 mt-7 text-base sm:text-lg leading-8 text-[#6b4a3a]">
                श्रद्धा, सेवा आणि पारदर्शकतेची परंपरा जपत —
                आमच्या गणेशोत्सवाच्या प्रत्येक योगदानाचा
                <span className="font-bold text-[#8f1d14]">
                  {" "}
                  स्पष्ट आणि डिजिटल हिशोब.
                </span>
              </p>

              <p className="max-w-lg mx-auto lg:mx-0 mt-3 text-sm leading-6 text-stone-500">
                A transparent digital platform for managing donations,
                receipts and festival expenses with trust at its heart.
              </p>

              {/* Buttons */}
              <div className="mt-9 flex flex-wrap justify-center lg:justify-start gap-3">
                <Link
                  href="/receipts/search"
                  className="group inline-flex items-center gap-3 rounded-xl bg-[#8f1d14] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#721b12] hover:shadow-xl"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
                    ↗
                  </span>

                  पावती शोधा
                  <span className="text-white/60">
                    Find Receipt
                  </span>
                </Link>

                <Link
                  href="/donations/list"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#c9a45c]/60 bg-white/80 px-6 py-3.5 text-sm font-bold text-[#6b2416] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#a16207] hover:bg-white hover:shadow-lg"
                >
                  देणगी सूची
                  <span className="text-xs font-medium text-stone-400">
                    Collections
                  </span>
                </Link>
              </div>
            </div>

            {/* =====================================================
                ORNAMENTAL MANDALA
            ====================================================== */}

            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute h-[370px] w-[370px] rounded-full bg-orange-200/20 blur-3xl" />

              <div className="relative h-[330px] w-[330px] sm:h-[390px] sm:w-[390px]">
                {/* Outer circles */}
                <div className="absolute inset-0 rounded-full border border-[#b45309]/20" />
                <div className="absolute inset-[12px] rounded-full border border-[#b45309]/20" />
                <div className="absolute inset-[28px] rounded-full border border-[#b45309]/15" />

                {/* Rotating-ish ornamental dotted ring */}
                <div className="absolute inset-[42px] rounded-full border border-dashed border-[#a16207]/30" />

                {/* Mandala petals */}
                <div className="absolute inset-[60px] rounded-full border-2 border-[#b45309]/20" />

                {[
                  "top-0 left-1/2 -translate-x-1/2",
                  "top-1/2 right-0 -translate-y-1/2",
                  "bottom-0 left-1/2 -translate-x-1/2",
                  "top-1/2 left-0 -translate-y-1/2",
                ].map((position, index) => (
                  <div
                    key={index}
                    className={`absolute ${position} h-16 w-16 rounded-full border border-[#c2410c]/20 bg-[#fff8e7]/80`}
                  />
                ))}

                {/* Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex h-44 w-44 sm:h-52 sm:w-52 items-center justify-center rounded-full border border-[#d6a64f]/50 bg-gradient-to-br from-[#fff9e9] to-[#f7e7c5] shadow-[0_25px_70px_rgba(120,53,15,0.16)]">
                    <div className="absolute inset-3 rounded-full border border-[#a16207]/20" />

                    <div className="text-center">
                      <div className="text-6xl sm:text-7xl leading-none">
                        🪔
                      </div>

                      <p className="mt-2 text-[10px] font-black tracking-[0.28em] uppercase text-[#8f1d14]">
                        श्रद्धा • सेवा • विश्वास
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative dots */}
                {[
                  "top-[18%] left-[16%]",
                  "top-[18%] right-[16%]",
                  "bottom-[18%] left-[16%]",
                  "bottom-[18%] right-[16%]",
                ].map((position, index) => (
                  <span
                    key={index}
                    className={`absolute ${position} h-2.5 w-2.5 rounded-full bg-[#c2410c]/50`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            PUBLIC STATS PANEL
        ========================================================== */}

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 -mb-16">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#d6b36a]/40 bg-[#35140d] shadow-[0_25px_80px_rgba(68,32,16,0.25)]">
            {/* Decorative glow */}
            <div className="absolute -top-32 right-0 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />
            <div className="absolute -bottom-40 left-20 h-72 w-72 rounded-full bg-red-700/20 blur-3xl" />

            <div className="relative grid lg:grid-cols-[1.25fr_1fr]">
              {/* Main collection */}
              <div className="p-7 sm:p-10 lg:p-12">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.1)]" />

                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-amber-200/70">
                    Live Public Collection
                  </p>
                </div>

                <p className="mt-5 text-sm font-medium text-amber-100/60">
                  एकूण जमा रक्कम
                </p>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-semibold text-amber-300">
                    ₹
                  </span>

                  <span className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-0.04em] text-[#fff7df]">
                    {stats.totalCollection.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-3 text-xs text-amber-100/50">
                  <span className="h-px w-12 bg-amber-300/30" />
                  <span>Every contribution counts</span>
                </div>
              </div>

              {/* Secondary stats */}
              <div className="grid grid-cols-2 border-t lg:border-t-0 lg:border-l border-white/10">
                <StatBox
                  label="Total Receipts"
                  marathi="एकूण पावत्या"
                  value={stats.totalReceipts.toLocaleString("en-IN")}
                  icon="▤"
                />

                <StatBox
                  label="Net Balance"
                  marathi="शिल्लक रक्कम"
                  value={`₹${stats.netBalance.toLocaleString("en-IN")}`}
                  icon="◈"
                  green
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          FEATURES
      ========================================================== */}

      <main className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-32 pb-20">
        {/* Section heading */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#d6a64f]" />

            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#a16207]">
              आमची मूल्ये
            </span>

            <span className="h-px w-12 bg-[#d6a64f]" />
          </div>

          <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-[#461a0b]">
            विश्वासावर उभारलेली
            <span className="text-[#a52a16]"> पारदर्शकता.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-7 text-stone-500">
            Technology आम्हाला व्यवस्थापन सोपे करते,
            पण आमची खरी ताकद आहे — समाजाचा विश्वास.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          <InfoCard
            number="01"
            icon="◫"
            title="पारदर्शक हिशोब"
            english="Complete Transparency"
            text="प्रत्येक देणगी आणि खर्चाची नोंद सुरक्षितपणे केली जाते, जेणेकरून मंडळाचा आर्थिक व्यवहार सर्वांसाठी स्पष्ट राहील."
          />

          <InfoCard
            number="02"
            icon="⌁"
            title="डिजिटल पावती"
            english="Instant Digital Receipt"
            text="देणगी दिल्यानंतर अद्वितीय क्रमांक आणि QR verification सह डिजिटल पावती सहज शोधा आणि मिळवा."
          />

          <InfoCard
            number="03"
            icon="⌁"
            title="सुरक्षित UPI"
            english="Simple & Secure"
            text="Cash किंवा कागदी प्रक्रियेऐवजी सुरक्षित डिजिटल माध्यमातून योगदान द्या आणि आपल्या देणगीचा मागोवा ठेवा."
          />
        </div>

        {/* =====================================================
            TRUST STRIP
        ====================================================== */}

        <div className="mt-16 overflow-hidden rounded-3xl border border-[#dfc996]/50 bg-white/70 shadow-sm">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#eadfc7]">
            <TrustItem
              icon="✓"
              title="Verified Records"
              text="सत्यापित आर्थिक नोंदी"
            />

            <TrustItem
              icon="⌁"
              title="Digital First"
              text="पूर्णपणे डिजिटल व्यवस्था"
            />

            <TrustItem
              icon="♡"
              title="Community Driven"
              text="समाजाच्या विश्वासासाठी"
            />
          </div>
        </div>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}

        <section className="relative mt-20 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#7f1d1d] via-[#8f1d14] to-[#5f160f] px-7 py-12 sm:px-12 sm:py-14 text-center shadow-[0_25px_70px_rgba(127,29,29,0.22)]">
          {/* Decorative circles */}
          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -right-16 -bottom-24 h-64 w-64 rounded-full border border-white/10" />

          <div className="relative">
            <div className="text-3xl">🪔</div>

            <h3 className="mt-4 text-2xl sm:text-3xl font-black text-[#fff8e7]">
              तुमचा विश्वास, आमची जबाबदारी.
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-red-100/75">
              View collections, verify your receipt or explore the
              festival&apos;s public expenses — all from one place.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/donations/list"
                className="rounded-xl bg-[#fff8e7] px-6 py-3 text-sm font-bold text-[#721b12] shadow-lg transition hover:-translate-y-0.5 hover:bg-white"
              >
                View Collections
              </Link>

              <Link
                href="/expenses"
                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                View Expenses
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-amber-200/20 px-6 py-3 text-sm font-semibold text-amber-100 transition hover:bg-white/10"
              >
                Portal Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================
          FOOTER
      ========================================================== */}

      <footer className="relative border-t border-[#e5d7bd] bg-[#f7f0e3]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8f1d14] text-sm text-white">
                ॐ
              </div>

              <div>
                <p className="text-sm font-bold text-[#6b2416]">
                  देवदूत गणेश मित्र मंडळ
                </p>

                <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400">
                  Devdoot Ganesh Mitra Mandal
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-500 text-center sm:text-right">
              © {year} Devdoot Ganesh Mitra Mandal
              <span className="mx-2 text-[#d6a64f]">•</span>
              श्रद्धा • सेवा • पारदर्शकता
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* =============================================================
   COMPONENTS
============================================================= */

function StatBox({
  label,
  marathi,
  value,
  icon,
  green = false,
}) {
  return (
    <div className="flex min-h-[190px] flex-col justify-center p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
            green
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : "border-amber-300/20 bg-amber-300/10 text-amber-200"
          }`}
        >
          {icon}
        </span>

        <span className="text-[10px] font-bold tracking-widest text-white/25">
          LIVE
        </span>
      </div>

      <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-100/50">
        {label}
      </p>

      <p className="mt-1 text-[11px] text-white/30">
        {marathi}
      </p>

      <p
        className={`mt-2 break-all text-2xl sm:text-3xl font-black ${
          green ? "text-emerald-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function InfoCard({
  number,
  icon,
  title,
  english,
  text,
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[#e3d5bc] bg-white/80 p-7 shadow-[0_10px_35px_rgba(84,52,28,0.05)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#c9a45c]/60 hover:shadow-[0_25px_50px_rgba(84,52,28,0.1)]">
      {/* Number */}
      <div className="absolute right-6 top-5 text-[10px] font-black tracking-widest text-stone-300">
        {number}
      </div>

      {/* Icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e5c77d]/50 bg-[#fff8e7] text-2xl text-[#a52a16] shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>

      <h3 className="mt-7 text-xl font-black text-[#4b2114]">
        {title}
      </h3>

      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b45309]/70">
        {english}
      </p>

      <p className="mt-5 text-sm leading-7 text-stone-500">
        {text}
      </p>

      <div className="mt-6 h-px w-12 bg-[#d6a64f] transition-all duration-500 group-hover:w-20" />
    </div>
  );
}

function TrustItem({
  icon,
  title,
  text,
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-6 sm:px-8">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff5df] text-[#a52a16] font-bold">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold text-[#4b2114]">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-stone-400">
          {text}
        </p>
      </div>
    </div>
  );
}