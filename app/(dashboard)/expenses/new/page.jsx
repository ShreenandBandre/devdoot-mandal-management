// app/(dashboard)/expenses/new/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Decoration",
  "Sound System",
  "Lighting",
  "Flowers",
  "Prasad",
  "Food",
  "Printing",
  "Transportation",
  "Electricity",
  "Miscellaneous",
];

export default function NewExpensePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[0],
    amount: "",
    paymentMode: "Cash",
    vendor: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [billFile, setBillFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Handle file selection, compress image for mobile, and convert safely
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 800; // Resize width to optimize mobile heavy uploads
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * (scaleSize < 1 ? scaleSize : 1);

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Compress image to JPEG quality 0.7
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
            setBillFile(file);
            setPreviewUrl(compressedDataUrl);
          };
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs or other documents
        setBillFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(false);

    try {
      const billUrl = previewUrl || "";

      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: Number(form.amount), billUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(true);
        setForm({
          title: "",
          category: CATEGORIES[0],
          amount: "",
          paymentMode: "Cash",
          vendor: "",
          description: "",
          date: new Date().toISOString().slice(0, 10),
        });
        setBillFile(null);
        setPreviewUrl("");
        setTimeout(() => {
          setSuccessMessage(false);
          router.push("/expenses");
        }, 1500);
      } else {
        alert(`Failed to save expense: ${data.error || "Unknown server error"}`);
      }
    } catch (err) {
      console.error("Submission Error:", err);
      alert(`Network error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 border border-gray-100">
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Add New Expense</h1>
          <p className="text-sm text-gray-600 mt-1">Log festival operational bills, vendor charges, or purchases.</p>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm p-4 rounded-xl mb-6 shadow-sm font-medium">
            ✅ Expense saved successfully! Redirecting...
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <Field label="Expense Title">
            <input
              required
              placeholder="e.g., Stage Decoration Advance"
              className="input border border-gray-300 rounded-xl p-3 w-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>

          <Field label="Category">
            <select
              className="input border border-gray-300 rounded-xl p-3 w-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm font-medium"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Amount (₹)">
              <input
                required
                type="number"
                placeholder="0.00"
                className="input border border-gray-300 rounded-xl p-3 w-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm font-semibold"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </Field>

            <Field label="Payment Mode">
              <select
                className="input border border-gray-300 rounded-xl p-3 w-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm font-medium"
                value={form.paymentMode}
                onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Vendor / Paid To">
              <input
                placeholder="Vendor or shop name"
                className="input border border-gray-300 rounded-xl p-3 w-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
              />
            </Field>

            <Field label="Expense Date">
              <input
                type="date"
                className="input border border-gray-300 rounded-xl p-3 w-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Description (Optional)">
            <textarea
              rows="2"
              placeholder="Additional details about the expense"
              className="input border border-gray-300 rounded-xl p-3 w-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>

          <Field label="Upload Bill / Receipt Attachment (Optional)">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-all border border-gray-300 rounded-xl p-2 bg-white shadow-sm"
              onChange={handleFileChange}
            />
            {previewUrl && (
              <div className="mt-3 flex items-center gap-3 bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                <span className="text-xs font-bold text-orange-800">Preview Attached:</span>
                <a 
                  href={previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-orange-700 underline font-medium hover:text-orange-900"
                >
                  Click to View Compressed Image
                </a>
              </div>
            )}
          </Field>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving Expense..." : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      <span className="mb-1.5 block text-gray-800 font-semibold">{label}</span>
      <div>{children}</div>
    </label>
  );
}