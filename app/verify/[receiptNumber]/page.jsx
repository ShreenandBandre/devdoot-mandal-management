// app/verify/[receiptNumber]/page.jsx
import { connectDB } from "@/lib/db";
import Donation from "@/lib/models/Donation";
 
export default async function VerifyReceipt({ params }) {
  await connectDB();
  const donation = await Donation.findOne({
    receiptNumber: params.receiptNumber,
    isDeleted: false,
  }).lean();
 
  if (!donation) {
    return <StatusCard ok={false} message="No receipt found with this number." />;
  }
 
  return (
    <div className="max-w-md mx-auto mt-16 border rounded-xl shadow p-6 text-center">
      <div className="text-green-600 text-4xl">✔</div>
      <h1 className="text-xl font-bold mt-2">Receipt Verified</h1>
      <p className="text-sm text-gray-500 mb-4">This is a genuine Devdoot Mandal receipt.</p>
      <dl className="text-left text-sm space-y-1">
        <Row label="Receipt No." value={donation.receiptNumber} />
        <Row label="Donor Name" value={donation.name} />
        <Row label="Amount" value={`₹${donation.amount.toLocaleString("en-IN")}`} />
        <Row label="Payment Mode" value={donation.paymentMode} />
        <Row label="Date" value={new Date(donation.createdAt).toLocaleString("en-IN")} />
        <Row label="Collected By" value={donation.collectorName} />
      </dl>
    </div>
  );
}
 
function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b py-1">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
 
function StatusCard({ ok, message }) {
  return (
    <div className="max-w-md mx-auto mt-16 border rounded-xl shadow p-6 text-center">
      <div className="text-red-600 text-4xl">✕</div>
      <p className="mt-2 text-gray-700">{message}</p>
    </div>
  );
}