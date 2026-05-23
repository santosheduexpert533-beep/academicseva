import { NextResponse } from 'next/server';
import getRazorpay from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const { amount, currency, email, name, pan, taxExempt } = await request.json();

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount,
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        email: email || '',
        name: name || '',
        pan: pan || '',
        taxExempt: taxExempt ? 'true' : 'false',
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating order:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
