import resend from './resend';

export async function sendConfirmationEmail(
  to: string,
  paymentId: string,
  amount: number
) {
  const driveLink = process.env.GOOGLE_DRIVE_ACCESS_LINK!;
  const formattedAmount = (amount / 100).toFixed(2);

  await resend.emails.send({
    from: process.env.SENDER_EMAIL!,
    to,
    subject: 'Payment Successful - Access Your Bundle',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Payment Successful!</h1>
        <p>Thank you for your purchase.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Payment ID:</strong> ${paymentId}</p>
          <p><strong>Amount:</strong> ₹${formattedAmount}</p>
        </div>
        <p>Click the button below to access your bundle:</p>
        <a href="${driveLink}" style="display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
          Access Your Bundle
        </a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          If you have any questions, reply to this email.
        </p>
      </div>
    `,
  });
}
