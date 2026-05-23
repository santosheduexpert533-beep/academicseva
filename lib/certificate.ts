import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';

const NGO_NAME = process.env.NGO_NAME || 'Academic Expert Seva Charitable Trust';
const NGO_ADDRESS = process.env.NGO_ADDRESS || '';
const NGO_80G_REG = process.env.NGO_80G_REG || '';
const NGO_PAN = process.env.NGO_PAN || '';
const NGO_REG_NO = process.env.NGO_REG_NO || '';
const NGO_CONTACT = process.env.NGO_CONTACT || '';

const NAVY = rgb(0.035, 0.078, 0.149);
const GOLD = rgb(0.851, 0.467, 0.024);
const WHITE = rgb(1, 1, 1);
const DARK = rgb(0.09, 0.11, 0.122);
const LABEL = rgb(0.271, 0.278, 0.298);
const GRAY = rgb(0.459, 0.467, 0.49);
const WARM = rgb(0.98, 0.976, 0.965);
const BORDER = rgb(0.886, 0.91, 0.941);
const TAGLINE = rgb(0.737, 0.784, 0.871);
const PAN_BG = rgb(0.894, 0.914, 0.929);

export async function generate80GCertificate(params: {
  donorName: string;
  donorPan: string;
  amount: number;
  paymentId: string;
  certificateNumber: string;
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  const serif = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const serifB = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const sansB = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdfDoc.embedFont(StandardFonts.Courier);

  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const m = 36;
  const cx = m + 10;
  const cw = width - 2 * m - 20;

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // ── Borders ──
  page.drawRectangle({ x: m - 6, y: m - 6, width: width - 2 * m + 12, height: height - 2 * m + 12, borderColor: GOLD, borderWidth: 2 });
  page.drawRectangle({ x: m, y: m, width: width - 2 * m, height: height - 2 * m, borderColor: NAVY, borderWidth: 1 });

  // ── Header bar ──
  const hY = 737;
  const hH = 65;
  page.drawRectangle({ x: cx, y: hY, width: cw, height: hH, color: NAVY });

  page.drawText(NGO_NAME, { x: cx + 10, y: hY + 40, size: 16, font: serifB, color: WHITE });
  page.drawText('Empowering Futures Through Education', { x: cx + 10, y: hY + 22, size: 8, font: sans, color: TAGLINE });

  const asCX = cx + cw - 20;
  const asCY = hY + hH / 2 + 2;
  page.drawEllipse({ x: asCX, y: asCY, xScale: 20, yScale: 20, color: WHITE });
  const asW = serifB.widthOfTextAtSize('AS', 13);
  page.drawText('AS', { x: asCX - asW / 2, y: asCY - 7, size: 13, font: serifB, color: NAVY });

  // ── 80G Tax Exemption Certificate title ──
  let y = hY - 28;

  const title = '80G Tax Exemption Certificate';
  const tW = serifB.widthOfTextAtSize(title, 18);
  page.drawText(title, { x: (width - tW) / 2, y, size: 18, font: serifB, color: NAVY });

  page.drawLine({ start: { x: width / 2 - 70, y: y - 6 }, end: { x: width / 2 + 70, y: y - 6 }, thickness: 2, color: GOLD });

  // ── Certificate No & Date ──
  y = y - 36;

  const labelSize = 9;
  const valSize = 12;

  page.drawText('Certificate No.', { x: cx + 4, y, size: labelSize, font: sans, color: GRAY });

  const dateLabelW = sans.widthOfTextAtSize('Date of Issue', labelSize);
  page.drawText('Date of Issue', { x: cx + cw - 4 - dateLabelW, y, size: labelSize, font: sans, color: GRAY });

  y = y - 18;

  page.drawText(params.certificateNumber, { x: cx + 4, y, size: valSize, font: serifB, color: NAVY });

  const dateV = today;
  const dateVW = serifB.widthOfTextAtSize(dateV, valSize);
  page.drawText(dateV, { x: cx + cw - 4 - dateVW, y, size: valSize, font: serifB, color: NAVY });

  // ── Declaration ──
  y = y - 38;

  const decl1 = 'This is to certify that';
  const decl2 = `${params.donorName}`;
  const decl3 = `has generously contributed to the causes supported by ${NGO_NAME}.`;

  page.drawText(decl1, { x: cx + 4, y, size: 13, font: serif, color: DARK });
  y = y - 22;

  const d2W = serifB.widthOfTextAtSize(decl2, 15);
  page.drawText(decl2, { x: cx + 4, y, size: 15, font: serifB, color: NAVY });
  const nameUnderline = d2W + 12;
  page.drawLine({ start: { x: cx + 4, y: y - 2 }, end: { x: cx + 4 + nameUnderline, y: y - 2 }, thickness: 0.5, color: BORDER });

  y = y - 24;

  const fullText = `${decl3}`;
  page.drawText(fullText, { x: cx + 4, y, size: 13, font: serif, color: DARK });

  // ── PAN badge ──
  if (params.donorPan) {
    y = y - 28;

    const panLabel = 'PAN NUMBER';
    const panLabelW = sansB.widthOfTextAtSize(panLabel, 9);
    const panLabelP = 10;
    const panPad = 8;
    const panBgW = panLabelW + panPad * 2;

    page.drawRectangle({ x: cx + 4, y: y - 2, width: panBgW, height: 20, color: PAN_BG });
    page.drawText(panLabel, { x: cx + 4 + panPad, y: y + 5, size: 9, font: sansB, color: LABEL });

    const panVal = params.donorPan.toUpperCase();
    page.drawText(panVal, { x: cx + 4 + panBgW + 12, y: y + 4, size: 14, font: serifB, color: NAVY });
  }

  // ── Donation Summary box ──
  y = y - 50;

  const dsH = 100;
  page.drawRectangle({ x: cx + 4, y: y - dsH, width: cw - 8, height: dsH, color: WARM, borderColor: BORDER, borderWidth: 1 });

  const dsLabel = 'DONATION SUMMARY';
  page.drawText(dsLabel, { x: cx + 20, y: y - 16, size: 9, font: sansB, color: GOLD });

  const colW = (cw - 8 - 32) / 3;

  // Col layout
  const payIdX = cx + 20;
  const amtX = cx + 20 + colW + 8;
  const dateX = cx + 20 + 2 * (colW + 8);

  const colLabelSize = 8;
  const colValSize = 11;

  // Payment ID
  page.drawText('Payment ID', { x: payIdX, y: y - 38, size: colLabelSize, font: sans, color: GRAY });
  const pidW = mono.widthOfTextAtSize(params.paymentId, colValSize);
  page.drawText(params.paymentId, {
    x: payIdX,
    y: y - 58,
    size: colValSize,
    font: mono,
    color: NAVY,
    maxWidth: colW,
  });

  // Amount
  page.drawText('Amount', { x: amtX, y: y - 38, size: colLabelSize, font: sans, color: GRAY });
  const amtStr = `Rs. ${params.amount}/-`;
  page.drawText(amtStr, { x: amtX, y: y - 62, size: 20, font: serifB, color: GOLD });

  // Date
  page.drawText('Date', { x: dateX, y: y - 38, size: colLabelSize, font: sans, color: GRAY });
  page.drawText(today, { x: dateX, y: y - 58, size: colValSize, font: serifB, color: NAVY });

  // ── Trust Details & Address (2 columns) ──
  y = y - dsH - 16;

  const col2W = (cw - 8 - 24) / 2;

  // Left: Trust Details
  const tdX = cx + 4;
  page.drawText('Trust Details', { x: tdX, y: y, size: labelSize, font: sansB, color: NAVY });

  const tdItems: [string, string][] = [
    ['Registration No.', NGO_REG_NO],
    ['80G Registration', NGO_80G_REG],
    ['Trust PAN', NGO_PAN],
  ];

  let tdY = y - 24;
  const tdRowH = 22;
  for (const [label, val] of tdItems) {
    const rowY = tdY;
    page.drawLine({ start: { x: tdX, y: rowY }, end: { x: tdX + col2W, y: rowY }, thickness: 0.5, color: BORDER });
    page.drawText(label, { x: tdX, y: rowY + 4, size: 10, font: sans, color: LABEL });
    const valW = sansB.widthOfTextAtSize(val, 10);
    page.drawText(val, { x: tdX + col2W - valW, y: rowY + 4, size: 10, font: sansB, color: NAVY });
    tdY = tdY - tdRowH;
  }

  // Right: Address
  const addrX = cx + 4 + col2W + 24;
  page.drawText('Registered Address', { x: addrX, y, size: labelSize, font: sansB, color: NAVY });

  const addrY = y - 22;
  page.drawText(NGO_ADDRESS, { x: addrX, y: addrY, size: 10, font: serif, color: LABEL, lineHeight: 14, maxWidth: col2W });

  if (NGO_CONTACT) {
    page.drawText(NGO_CONTACT, { x: addrX, y: addrY - 50, size: 10, font: sans, color: LABEL });
  }

  // ── Separator line (bottom of trust details) ──
  const trustEndY = Math.min(addrY - 50 - 10, tdY + 10);
  y = trustEndY - 16;

  // ── Authorized Signatory ──
  const sigW = 200;
  const sigX = cx + cw - sigW - 8;
  page.drawLine({ start: { x: sigX, y }, end: { x: sigX + sigW, y }, thickness: 1.5, color: NAVY });
  page.drawText('Authorized Signatory', { x: sigX + (sigW - serifB.widthOfTextAtSize('Authorized Signatory', 11)) / 2, y: y - 18, size: 11, font: serifB, color: NAVY });
  page.drawText('For Academic Expert Seva Trust', { x: sigX + (sigW - sans.widthOfTextAtSize('For Academic Expert Seva Trust', 8)) / 2, y: y - 32, size: 8, font: sans, color: GRAY });

  // ── Disclaimer ──
  page.drawText(
    'This is a computer-generated certificate and does not require a physical signature. All contributions to Academic Expert Seva Charitable Trust are tax-exempt under Section 80G of the Income Tax Act, 1961.',
    { x: cx + 4, y: m + 12, size: 8, font: serif, color: GRAY, lineHeight: 12, maxWidth: cw - 8 }
  );

  // ── "ACADEMIC SEVA" watermark ──
  const wmText = 'ACADEMIC SEVA';
  const wmColor = rgb(0.88, 0.88, 0.88);
  for (let i = 0; i < 8; i++) {
    page.drawText(wmText, {
      x: 20 + i * 78,
      y: 100 + i * 90,
      size: 42,
      font: serifB,
      color: wmColor,
      rotate: degrees(-45),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export function generateCertificateNumber(paymentId: string): string {
  const year = new Date().getFullYear();
  const short = paymentId.slice(-5).toUpperCase();
  return `80G/AS/${year}/${short}`;
}
