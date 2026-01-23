import QRCode from "qrcode";

export async function makeQrPng(url: string): Promise<Buffer> {
  // PNG 1024px cho in rõ, margin vừa phải
  const buf = await QRCode.toBuffer(url, {
    type: "png",
    width: 1024,
    margin: 2,
    errorCorrectionLevel: "M",
  });
  return buf;
}
