import { NextResponse } from 'next/server';
import { decryptCertToken } from '@/lib/token';
import { generate80GCertificate } from '@/lib/certificate';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const data = decryptCertToken(token);

    if (!data) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 410 });
    }

    const pdfBytes = await generate80GCertificate({
      donorName: data.name,
      donorPan: data.pan,
      amount: data.amount,
      paymentId: data.paymentId,
      certificateNumber: data.certNumber,
    });

    const filename = `80G_Certificate_${data.certNumber.replace(/\//g, '_')}.pdf`;
    const buf = Buffer.from(pdfBytes);

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buf.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating certificate PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
