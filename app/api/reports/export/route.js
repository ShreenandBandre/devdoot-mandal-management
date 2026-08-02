// app/api/reports/export/route.js
import ExcelJS from "exceljs";
import { connectDB } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import Expense from "@/lib/models/Expense";
 
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "donations";
  const format = searchParams.get("format") || "xlsx";
 
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(type);
 
  if (type === "donations") {
    sheet.columns = [
      { header: "Receipt No.", key: "receiptNumber", width: 18 },
      { header: "Date", key: "date", width: 16 },
      { header: "Name", key: "name", width: 24 },
      { header: "Address", key: "address", width: 30 },
      { header: "Amount", key: "amount", width: 12 },
      { header: "Mode", key: "paymentMode", width: 10 },
      { header: "Collector", key: "collectorName", width: 18 },
    ];
    const rows = await Donation.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
    rows.forEach((r) => sheet.addRow({
      receiptNumber: r.receiptNumber,
      date: new Date(r.createdAt).toLocaleString("en-IN"),
      name: r.name, address: r.address, amount: r.amount,
      paymentMode: r.paymentMode, collectorName: r.collectorName,
    }));
  }
 
  if (type === "expenses") {
    sheet.columns = [
      { header: "Date", key: "date", width: 14 },
      { header: "Title", key: "title", width: 24 },
      { header: "Category", key: "category", width: 16 },
      { header: "Amount", key: "amount", width: 12 },
      { header: "Mode", key: "paymentMode", width: 10 },
      { header: "Vendor", key: "vendor", width: 20 },
    ];
    const rows = await Expense.find({ isDeleted: false }).sort({ date: -1 }).lean();
    rows.forEach((r) => sheet.addRow({
      date: new Date(r.date).toLocaleDateString("en-IN"), title: r.title,
      category: r.category, amount: r.amount, paymentMode: r.paymentMode, vendor: r.vendor,
    }));
  }
 
  sheet.getRow(1).font = { bold: true };
 
  if (format === "csv") {
    const buffer = await workbook.csv.writeBuffer();
    return new Response(buffer, {
      headers: { "Content-Type": "text/csv", "Content-Disposition": `attachment; filename="${type}.csv"` },
    });
  }
 
  const buffer = await workbook.xlsx.writeBuffer();
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${type}.xlsx"`,
    },
  });
}