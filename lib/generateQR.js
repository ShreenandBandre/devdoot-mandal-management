// lib/generateQR.js
import QRCode from "qrcode";
 
export async function generateQR(text) {
  return QRCode.toDataURL(text, { margin: 1, width: 300 });
}