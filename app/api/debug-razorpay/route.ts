import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { Resend } from 'resend';
import { generate80GCertificate, generateCertificateNumber } from '@/lib/certificate';

export async function GET() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const resendApiKey = process.env.RESEND_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL;

  const result: Record<string, unknown> = {
    razorpay: { keySet: !!keyId && !!keySecret, keyIdPrefix: keyId ? keyId.slice(0, 12) : null },
    resend: { keySet: !!resendApiKey, senderEmail: senderEmail || 'NOT SET' },
  };

  // --- Razorpay tests ---
  if (keyId && keySecret) {
    try {
      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      const order = await razorpay.orders.create({ amount: 100, currency: 'INR', receipt: `sdk_${Date.now()}` });
      result.razorpay = { ...result.razorpay as object, sdkTest: { ok: true, orderId: order.id } };
    } catch (err: unknown) {
      const e = err as { statusCode?: number; error?: { description?: string; code?: string } };
      result.razorpay = { ...result.razorpay as object, sdkTest: { ok: false, statusCode: e?.statusCode, description: e?.error?.description, code: e?.error?.code } };
    }
  }

  // --- Full email test (with 80G certificate PDF) ---
  if (resendApiKey && senderEmail) {
    try {
      const certNumber = generateCertificateNumber('test_debug_001');
      const pdfBytes = await generate80GCertificate({
        donorName: 'TEST DONOR',
        donorPan: 'AAAAA0000A',
        amount: 1,
        paymentId: 'pay_debug_test',
        certificateNumber: certNumber,
      });
      result.pdfGeneration = { ok: true, size: pdfBytes.length };

      const resend = new Resend(resendApiKey);
      const emailRes = await resend.emails.send({
        from: senderEmail,
        to: senderEmail,
        subject: 'Debug test — with 80G certificate — Academic Seva',
        html: `<p>This is a test email with the 80G PDF attached.</p><p>Certificate: ${certNumber}</p>`,
        attachments: [{ filename: `80G_Certificate_${certNumber.replace(/\//g, '_')}.pdf`, content: Buffer.from(pdfBytes) }],
      });
      const emailId = (emailRes as { data?: { id?: string } })?.data?.id || 'unknown';
      result.resend = { ...result.resend as object, fullEmailTest: { ok: true, id: emailId } };
    } catch (err: unknown) {
      const e = err as { statusCode?: number; message?: string; error?: unknown };
      const msg = e?.message || (typeof e === 'object' ? JSON.stringify(e) : String(err));
      result.resend = { ...result.resend as object, fullEmailTest: { ok: false, error: msg } };
    }
  } else {
    result.resend = { ...result.resend as object, fullEmailTest: { ok: false, error: 'RESEND_API_KEY or SENDER_EMAIL not set' } };
  }

  return NextResponse.json(result);
}
