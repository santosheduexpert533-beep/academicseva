import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { Resend } from 'resend';

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

  // --- Resend test (send a test email to the configured sender) ---
  if (resendApiKey && senderEmail) {
    try {
      const resend = new Resend(resendApiKey);
      const emailRes = await resend.emails.send({
        from: senderEmail,
        to: senderEmail,
        subject: 'Debug test — Academic Seva',
        html: '<p>If you see this, Resend is working.</p>',
      });
      const emailId = (emailRes as { data?: { id?: string } })?.data?.id || 'unknown';
      result.resend = { ...result.resend as object, testSend: { ok: true, id: emailId } };
    } catch (err: unknown) {
      const e = err as { statusCode?: number; message?: string; error?: unknown };
      result.resend = { ...result.resend as object, testSend: { ok: false, error: e?.message || String(err) } };
    }
  } else {
    result.resend = { ...result.resend as object, testSend: { ok: false, error: 'RESEND_API_KEY or SENDER_EMAIL not set' } };
  }

  return NextResponse.json(result);
}
