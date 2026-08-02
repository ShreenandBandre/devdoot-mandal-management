// components/dashboard/StatCard.jsx
export default function StatCard({ label, value, money, highlight, sub }) {
  return (
    <div className={`rounded-xl p-4 shadow-sm border ${highlight ? "bg-orange-700 text-white" : "bg-white"}`}>
      <p className={`text-xs ${highlight ? "text-orange-100" : "text-gray-500"}`}>{label}</p>
      <p className="text-2xl font-bold mt-1">
        {money ? `₹${Number(value).toLocaleString("en-IN")}` : value}
      </p>
      {sub && <p className={`text-xs mt-1 ${highlight ? "text-orange-100" : "text-gray-400"}`}>{sub}</p>}
    </div>
  );
}