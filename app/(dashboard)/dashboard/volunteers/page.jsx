// app/dashboard/volunteers/page.jsx
"use client";
import { useEffect, useState } from "react";

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", role: "volunteer" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function fetchVolunteers() {
    try {
      const res = await fetch("/api/volunteers");
      const data = await res.json();
      setVolunteers(data.volunteers || data || []);
    } catch (err) {
      console.error("Failed to fetch volunteers", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVolunteers();
  }, []);

  async function handleAddVolunteer(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/volunteers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    
    const data = await res.json();
    setSubmitting(false);

    if (res.ok) {
      setForm({ name: "", phone: "", email: "", password: "", role: "volunteer" });
      fetchVolunteers();
    } else {
      setError(data.error || "Failed to add volunteer");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 max-w-6xl mx-auto space-y-8 text-gray-900">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Volunteer Management</h1>
        <p className="text-sm text-gray-600 mt-1">Add and manage authorized collection volunteers for the festival.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Volunteer</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleAddVolunteer} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Name</label>
              <input
                required
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Phone</label>
              <input
                required
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                placeholder="Mobile number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
              <input
                required
                type="email"
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
              <input
                required
                type="password"
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                placeholder="Login password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Role</label>
              <select
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm font-medium"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="volunteer">Volunteer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-700 hover:bg-orange-800 text-white font-semibold p-3.5 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Volunteer"}
            </button>
          </form>
        </div>

        {/* Volunteers List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Authorized Team</h2>
          {loading ? (
            <p className="text-gray-600 text-sm">Loading volunteers...</p>
          ) : volunteers.length === 0 ? (
            <p className="text-gray-500 text-sm">No volunteers registered yet.</p>
          ) : (
            <div className="space-y-3">
              {volunteers.map((v) => (
                <div key={v._id || v.email} className="border border-gray-200 p-4 rounded-xl flex items-center justify-between bg-gray-50/50">
                  <div>
                    <p className="font-bold text-gray-900">{v.name}</p>
                    <p className="text-sm text-gray-600">{v.phone} {v.email && `· ${v.email}`}</p>
                    <p className="text-xs text-orange-700 mt-1 font-medium">
                      Collections: ₹{v.totalCollected || 0} ({v.receiptCount || 0} receipts)
                    </p>
                  </div>
                  <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full border border-orange-200 uppercase">
                    {v.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}