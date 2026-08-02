// app/(dashboard)/dashboard/analytics/page.jsx
"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
 
const COLORS = ["#8B2500", "#C97B2E", "#1F6F3F", "#2E5C8A", "#7A4B99", "#B8862B"];
 
export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch("/api/analytics").then((r) => r.json()).then(setData); }, []);
  if (!data) return <p className="p-6">Loading charts...</p>;
 
  return (
    <div className="p-6 grid md:grid-cols-2 gap-8">
      <ChartCard title="Daily Collection Trend">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.dailyCollection}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#8B2500" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
 
      <ChartCard title="Cash vs UPI">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data.cashVsUpi} dataKey="total" nameKey="_id" outerRadius={90} label>
              {data.cashVsUpi.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
 
      <ChartCard title="Expense Categories">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.expenseByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" fontSize={9} interval={0} angle={-30} textAnchor="end" height={60} />
            <YAxis fontSize={10} />
            <Tooltip />
            <Bar dataKey="total" fill="#C97B2E" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
 
      <ChartCard title="Top Collectors">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.topCollectors} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" fontSize={10} />
            <YAxis dataKey="_id" type="category" width={100} fontSize={10} />
            <Tooltip />
            <Bar dataKey="total" fill="#1F6F3F" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
 
function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-3">{title}</h3>
      {children}
    </div>
  );
}