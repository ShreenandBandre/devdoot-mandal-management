// lib/generateReceiptPDF.js
import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
 
const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderBottom: "2pt solid #8B2500", paddingBottom: 10, marginBottom: 16 },
  mandalName: { fontSize: 18, fontWeight: 700, color: "#8B2500" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { color: "#666" },
  value: { fontWeight: 700 },
  qr: { width: 90, height: 90 },
  footer: { marginTop: 24, fontSize: 9, color: "#888", textAlign: "center" },
});
 
export function ReceiptDocument({ donation, settings, qrCodeDataUrl }) {
  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.mandalName}>{settings.mandalName}</Text>
            <Text>{settings.address}</Text>
          </View>
          {settings.logoUrl && <Image src={settings.logoUrl} style={{ width: 48, height: 48 }} />}
        </View>
 
        <Text style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Donation Receipt</Text>
 
        <View style={styles.row}><Text style={styles.label}>Receipt No.</Text><Text style={styles.value}>{donation.receiptNumber}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Date & Time</Text><Text style={styles.value}>{new Date(donation.createdAt).toLocaleString("en-IN")}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Donor Name</Text><Text style={styles.value}>{donation.name}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Address</Text><Text style={styles.value}>{donation.address}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Amount</Text><Text style={styles.value}>Rs. {donation.amount.toLocaleString("en-IN")}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Payment Mode</Text><Text style={styles.value}>{donation.paymentMode}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Purpose</Text><Text style={styles.value}>{donation.purpose}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Collected By</Text><Text style={styles.value}>{donation.collectorName}</Text></View>
 
        <View style={{ alignItems: "center", marginTop: 16 }}>
          <Image src={qrCodeDataUrl} style={styles.qr} />
          <Text style={{ fontSize: 8, color: "#888", marginTop: 4 }}>Scan to verify this receipt</Text>
        </View>
 
        <Text style={styles.footer}>{settings.footerText || "Thank you for your generous contribution."}</Text>
      </Page>
    </Document>
  );
}
 
export async function renderReceiptPDF(props) {
  return renderToBuffer(<ReceiptDocument {...props} />);
}