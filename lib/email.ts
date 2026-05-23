import getResend from './resend';
import { generate80GCertificate, generateCertificateNumber } from './certificate';

export async function sendConfirmationEmail(
  to: string,
  paymentId: string,
  taxExempt: boolean,
  donorName?: string,
  donorPan?: string,
  amount?: number
) {
  const resend = getResend();
  const donationAmount = amount || 1;

  let attachment;
  let taxSectionHtml: string;

  if (taxExempt && donorName) {
    const certNumber = generateCertificateNumber(paymentId);
    const pdfBytes = await generate80GCertificate({
      donorName,
      donorPan: donorPan || '',
      amount: donationAmount,
      paymentId,
      certificateNumber: certNumber,
    });
    attachment = {
      filename: `80G_Certificate_${certNumber.replace(/\//g, '_')}.pdf`,
      content: Buffer.from(pdfBytes),
    };
    taxSectionHtml = `
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #D97706;">
        <p style="margin: 0; color: #92400e; font-weight: bold;">Tax Exemption (80G) — Certificate Attached</p>
        <p style="margin: 8px 0 0; color: #78350f; font-size: 14px;">Your donation is eligible for tax exemption under Section 80G. Please find your 80G certificate attached to this email.</p>
        <p style="margin: 8px 0 0; color: #78350f; font-size: 14px;">Certificate No.: <strong>${certNumber}</strong></p>
      </div>
    `;
  } else if (taxExempt) {
    taxSectionHtml = `
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #D97706;">
        <p style="margin: 0; color: #92400e; font-weight: bold;">Tax Exemption (80G)</p>
        <p style="margin: 8px 0 0; color: #78350f; font-size: 14px;">Your donation is eligible for tax exemption under Section 80G. A separate 80G receipt will be sent to you shortly.</p>
      </div>
    `;
  } else {
    taxSectionHtml = '';
  }

  await resend.emails.send({
    from: process.env.SENDER_EMAIL!,
    to,
    subject: taxExempt
      ? 'Thank You for Your Donation — 80G Certificate Attached — Academic Seva'
      : 'Thank You for Your Donation — Academic Seva',
    attachments: attachment ? [attachment] : undefined,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #D97706;">Thank You for Your Kindness!</h1>
        ${donorName ? `<p>Dear <strong>${donorName}</strong>,</p>` : ''}
        <p>Your contribution of <strong>₹${donationAmount}</strong> will directly help a student in need.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Payment ID:</strong> ${paymentId}</p>
          <p><strong>Amount:</strong> ₹${donationAmount}</p>
          <p><strong>Donor Email:</strong> ${to}</p>
        </div>
        ${taxSectionHtml}
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          If you have any questions, simply reply to this email.<br/>
          — Team Academic Seva
        </p>
      </div>
    `,
  });
}
