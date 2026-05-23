import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function GET() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const result: Record<string, unknown> = {
    keySet: !!keyId && !!keySecret,
    keyIdPrefix: keyId ? keyId.slice(0, 12) : null,
    keySecretLength: keySecret ? keySecret.length : null,
  };

  if (!keyId || !keySecret) {
    result.error = 'Keys not set in env';
    return NextResponse.json(result);
  }

  // Test via Razorpay SDK
  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({ amount: 100, currency: 'INR', receipt: `sdk_${Date.now()}` });
    result.sdkTest = { ok: true, orderId: order.id };
  } catch (err: unknown) {
    const e = err as { statusCode?: number; error?: { description?: string; code?: string } };
    result.sdkTest = { ok: false, statusCode: e?.statusCode, description: e?.error?.description, code: e?.error?.code };
  }

  // Test via raw fetch
  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
      body: JSON.stringify({ amount: 100, currency: 'INR', receipt: `fetch_${Date.now()}` }),
    });
    const body = await res.json();
    result.rawFetchTest = { status: res.status, ok: res.ok, body };
  } catch (err: unknown) {
    result.rawFetchTest = { error: String(err) };
  }

  return NextResponse.json(result);
}
