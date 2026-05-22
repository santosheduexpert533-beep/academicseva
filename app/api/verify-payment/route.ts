import { NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { razorpay_payment_id, email, taxExempt } = await request.json();

    // Send receipt email if email provided
    if (email && email.trim()) {
      await sendConfirmationEmail(email.trim(), razorpay_payment_id, taxExempt);
    }

    return NextResponse.json({
      success: true,
      message: 'Receipt sent',
    });
  } catch (error) {
    console.error('Error sending receipt:', error);
    return NextResponse.json(
      { error: 'Failed to send receipt' },
      { status: 500 }
    );
  }
}
