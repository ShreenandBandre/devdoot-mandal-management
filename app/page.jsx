// app/page.jsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-50 text-stone-800 flex flex-col justify-between">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-amber-700 via-orange-800 to-amber-900 text-white py-24 px-4 shadow-xl">
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

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap gap-4 justify-center items-center">
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