// app/dashboard/donations/new/page.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const emptyForm = {
  name: "",
  address: "",
  phone: "",
  amount: "",
  paymentMode: "Cash",
  purpose: "Ganpati Festival Donation",
  remarks: "",
  collectorName: "",
};

export default function NewDonationPage() {
  const [form, setForm] = useState(emptyForm);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    // Fetch settings to get common UPI QR and UPI ID
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch((err) => console.error("Failed to load settings", err));
  }, []);

  async function submit(e, skipDuplicateCheck = false) {
    e?.preventDefault();
    setSaving(true);
    setDuplicateWarning(false);
    
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: Number(form.amount), skipDuplicateCheck }),
      });
      setSaving(false);

      if (res.status === 409) {
        setDuplicateWarning(true);
        return;
      }
      if (!res.ok) {
        alert("Failed to save donation");
        return;
      }

      const { donation } = await res.json();
      setSuccessData(donation);
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
      setSaving(false);
      alert("Something went wrong");
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 border border-gray-100">
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">New Donation Entry</h1>
          <p className="text-sm text-gray-500 mt-1">Record a new contribution and generate an instant digital receipt.</p>
        </div>

        {successData && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6 text-center shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-900">Donation Saved Successfully!</h2>
              <p className="text-sm text-emerald-700 mt-1">
                Receipt No: <span className="font-semibold">{successData.receiptNumber}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={`/api/receipts/${successData._id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm"
              >
                📥 Download PDF Receipt
              </a>
              <Link
                href="/donations/list"
                className="border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm text-center"
              >
                📋 View Collections List
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setSuccessData(null)}
              className="text-xs text-emerald-600 hover:underline pt-1 block mx-auto"
            >
              + Add another donation
            </button>
          </div>
        )}

        {duplicateWarning && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6 text-sm text-yellow-800 shadow-sm">
            <p className="font-semibold flex items-center gap-1.5">⚠️ Household Duplicate Detected</p>
            <p className="mt-1 text-yellow-700">A donation already exists for this household this festival year. Would you like to proceed anyway?</p>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                className="bg-orange-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-800 transition-colors shadow-sm"
                onClick={(e) => submit(e, true)}
              >
                Yes, add anyway
              </button>
              <button
                type="button"
                className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                onClick={() => setDuplicateWarning(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!successData && (
          <form onSubmit={submit} className="space-y-4">
            <Field label="Donor Name">
              <input
                required
                placeholder="Enter donor's full name"
                className="input border border-gray-300 rounded-xl p-3 w-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>

            <Field label="Address">
              <textarea
                required
                rows="2"
                placeholder="House no, Society, Area"
                className="input border border-gray-300 rounded-xl p-3 w-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm resize-none"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Phone Number">
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="input border border-gray-300 rounded-xl p-3 w-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Field>

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
            </div>

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

            {/* Conditional UPI QR display box when UPI is selected */}
            {form.paymentMode === "UPI" && (
              <div className="p-5 border-2 border-orange-200 bg-orange-50/60 rounded-2xl text-center my-4 transition-all shadow-inner">
                <p className="font-bold text-orange-900 text-lg mb-1">Scan to Pay via UPI</p>
                {settings?.upiId && (
                  <p className="text-sm text-gray-700 mb-3">
                    UPI ID: <span className="font-semibold text-orange-800">{settings.upiId}</span>
                  </p>
                )}
                {settings?.commonQrUrl ? (
                  <div className="bg-white p-3 inline-block rounded-xl border border-orange-200 shadow-sm">
                    <img
                      src={settings.commonQrUrl}
                      alt="UPI QR Code"
                      className="w-44 h-44 mx-auto object-contain rounded"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-amber-700 bg-amber-100 p-2.5 rounded-lg border border-amber-200">
                    ⚠️ No QR image configured in Settings yet. You can add one via the settings panel.
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Collector Name">
                <input
                  required
                  placeholder="Name of collector"
                  className="input border border-gray-300 rounded-xl p-3 w-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                  value={form.collectorName}
                  onChange={(e) => setForm({ ...form, collectorName: e.target.value })}
                />
              </Field>

              <Field label="Remarks (Optional)">
                <input
                  placeholder="Any special notes"
                  className="input border border-gray-300 rounded-xl p-3 w-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                />
              </Field>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-orange-700 hover:bg-orange-800 active:bg-orange-900 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving Record..." : "Save & Generate Receipt"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      <span className="mb-1.5 block text-gray-700 font-semibold">{label}</span>
      <div>{children}</div>
    </label>
  );
}









// // app/(dashboard)/donations/new/page.jsx
// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
 
// const emptyForm = { name: "", address: "", phone: "", amount: "", paymentMode: "Cash",
//   purpose: "Ganpati Festival Donation", remarks: "", collectorName: "" };
 
// export default function NewDonationPage() {
//   const router = useRouter();
//   const [form, setForm] = useState(emptyForm);
//   const [duplicateWarning, setDuplicateWarning] = useState(false);
//   const [saving, setSaving] = useState(false);
 
//   async function submit(e, skipDuplicateCheck = false) {
//     e?.preventDefault();
//     setSaving(true);
//     const res = await fetch("/api/donations", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ...form, amount: Number(form.amount), skipDuplicateCheck }),
//     });
//     setSaving(false);
 
//     if (res.status === 409) return setDuplicateWarning(true);
//     if (!res.ok) return alert("Failed to save donation");
 
//     const { donation } = await res.json();
//     router.push(`/dashboard/receipts?highlight=${donation._id}`);
//   }
 
//   return (
//     <div className="max-w-xl mx-auto py-8">
//       <h1 className="text-xl font-bold mb-4">New Donation Entry</h1>
 
//       {duplicateWarning && (
//         <div className="bg-yellow-50 border border-yellow-400 rounded p-3 mb-4 text-sm">
//           ⚠️ A donation already exists for this household this year. Continue anyway?
//           <div className="mt-2 flex gap-2">
//             <button className="bg-orange-700 text-white px-3 py-1 rounded" onClick={(e) => submit(e, true)}>
//               Yes, add anyway
//             </button>
//             <button className="border px-3 py-1 rounded" onClick={() => setDuplicateWarning(false)}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
 
//       <form onSubmit={submit} className="space-y-3">
//         <Field label="Name"><input required className="input border rounded p-2 w-full" value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
//         <Field label="Address"><textarea required className="input border rounded p-2 w-full" value={form.address}
//           onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
//         <Field label="Phone"><input className="input border rounded p-2 w-full" value={form.phone}
//           onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
//         <Field label="Amount"><input required type="number" className="input border rounded p-2 w-full" value={form.amount}
//           onChange={(e) => setForm({ ...form, amount: e.target.value })} /></Field>
//         <Field label="Payment Mode">
//           <select className="input border rounded p-2 w-full" value={form.paymentMode}
//             onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}>
//             <option>Cash</option><option>UPI</option>
//           </select>
//         </Field>
//         <Field label="Collector Name"><input required className="input border rounded p-2 w-full" value={form.collectorName}
//           onChange={(e) => setForm({ ...form, collectorName: e.target.value })} /></Field>
//         <Field label="Remarks"><input className="input border rounded p-2 w-full" value={form.remarks}
//           onChange={(e) => setForm({ ...form, remarks: e.target.value })} /></Field>
 
//         <button disabled={saving} className="bg-orange-700 text-white px-4 py-2 rounded w-full">
//           {saving ? "Saving..." : "Save & Generate Receipt"}
//         </button>
//       </form>
//     </div>
//   );
// }
 
// function Field({ label, children }) {
//   return (
//     <label className="block text-sm">
//       <span className="text-gray-600">{label}</span>
//       <div className="mt-1">{children}</div>
//     </label>
//   );
// }