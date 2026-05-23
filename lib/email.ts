import getResend from './resend';
import { generate80GCertificate, generateCertificateNumber } from './certificate';

const NGO_NAME = process.env.NGO_NAME || 'Academic Expert Seva Charitable Trust';
const NGO_80G_REG = process.env.NGO_80G_REG || 'AALTA7396J';
const NGO_PAN = process.env.NGO_PAN || 'AALTA7396J';
const NGO_REG_NO = process.env.NGO_REG_NO || 'KA/2025/0708089';
const NGO_ADDRESS = process.env.NGO_ADDRESS || '';
const NGO_CONTACT = process.env.NGO_CONTACT || '';

function emailBody(params: {
  donorName?: string;
  donationAmount: number;
  paymentId: string;
  to: string;
  certNumber?: string;
  donorPan?: string;
  taxExempt: boolean;
}): string {
  const { donorName, donationAmount, paymentId, to, certNumber, donorPan, taxExempt } = params;
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const certSection = taxExempt && certNumber ? `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F4F2ED;border-radius:8px;border:1px solid #E2E8F0;margin:24px 0;overflow:hidden;">
      <tr>
        <td style="padding:0;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#091426;">
            <tr>
              <td style="padding:20px 24px;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:700;color:#ffffff;">Academic Expert Seva Charitable Trust</td>
                    <td align="right" style="font-family:Arial,sans-serif;font-size:10px;color:#BCC7DE;letter-spacing:0.1em;text-transform:uppercase;">Tax Exemption Certificate</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="padding:24px 24px 8px;text-align:center;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-bottom:2px solid #D97706;display:inline-block;">
                  <tr>
                    <td style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:700;color:#091426;padding-bottom:4px;">80G Tax Exemption Certificate</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 24px;">
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:10px;color:#75777D;letter-spacing:0.05em;text-transform:uppercase;padding:16px 0 4px;">Certificate No.</td>
              <td align="right" style="font-family:Arial,sans-serif;font-size:10px;color:#75777D;letter-spacing:0.05em;text-transform:uppercase;padding:16px 0 4px;">Date of Issue</td>
            </tr>
            <tr>
              <td style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-weight:700;color:#091426;">${certNumber}</td>
              <td align="right" style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-weight:700;color:#091426;">${today}</td>
            </tr>
          </table>

          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:16px 24px;">
            <tr>
              <td style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#171C1F;line-height:1.6;">
                This is to certify that <strong style="border-bottom:1px solid #E2E8F0;padding:0 8px;">${donorName || '—'}</strong>
                has generously contributed to the causes supported by Academic Expert Seva Charitable Trust.
              </td>
            </tr>
            ${donorPan ? `<tr><td style="padding-top:12px;"><table cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:Arial,sans-serif;font-size:10px;background:#E4E9ED;padding:4px 12px;border-radius:4px;letter-spacing:0.05em;text-transform:uppercase;color:#45474C;">PAN Number</td><td style="font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:700;color:#091426;padding-left:12px;letter-spacing:0.15em;">${donorPan}</td></tr></table></td></tr>` : ''}
          </table>

          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 24px;">
            <tr>
              <td style="background:#FAF9F6;border:1px solid #E2E8F0;border-radius:8px;padding:20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="font-family:Arial,sans-serif;font-size:10px;color:#9B4500;letter-spacing:0.1em;text-transform:uppercase;padding-bottom:12px;">DONATION SUMMARY</td>
                  </tr>
                  <tr>
                    <td>
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td width="33%" style="padding:8px 12px 8px 0;vertical-align:top;">
                            <div style="font-family:Arial,sans-serif;font-size:9px;color:#75777D;text-transform:uppercase;margin-bottom:2px;">Payment ID</div>
                            <div style="font-family:'Courier New',monospace;font-size:13px;font-weight:700;color:#091426;word-break:break-all;">${paymentId}</div>
                          </td>
                          <td width="33%" style="padding:8px 12px;vertical-align:top;">
                            <div style="font-family:Arial,sans-serif;font-size:9px;color:#75777D;text-transform:uppercase;margin-bottom:2px;">Amount</div>
                            <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#D97706;">Rs. ${donationAmount}/-</div>
                          </td>
                          <td width="33%" style="padding:8px 0 8px 12px;vertical-align:top;">
                            <div style="font-family:Arial,sans-serif;font-size:9px;color:#75777D;text-transform:uppercase;margin-bottom:2px;">Date</div>
                            <div style="font-family:Georgia,'Times New Roman',serif;font-size:13px;font-weight:700;color:#091426;">${today}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:16px 24px;">
            <tr>
              <td width="50%" style="vertical-align:top;padding-right:12px;">
                <div style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#091426;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:8px;">Trust Details</div>
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr><td style="font-family:Arial,sans-serif;font-size:12px;color:#45474C;padding:4px 0;border-bottom:1px dotted #E2E8F0;">Registration No.</td><td align="right" style="font-family:Arial,sans-serif;font-size:12px;font-weight:600;color:#091426;padding:4px 0;border-bottom:1px dotted #E2E8F0;">${NGO_REG_NO}</td></tr>
                  <tr><td style="font-family:Arial,sans-serif;font-size:12px;color:#45474C;padding:4px 0;border-bottom:1px dotted #E2E8F0;">80G Registration</td><td align="right" style="font-family:Arial,sans-serif;font-size:12px;font-weight:600;color:#091426;padding:4px 0;border-bottom:1px dotted #E2E8F0;">${NGO_80G_REG}</td></tr>
                  <tr><td style="font-family:Arial,sans-serif;font-size:12px;color:#45474C;padding:4px 0;border-bottom:1px dotted #E2E8F0;">Trust PAN</td><td align="right" style="font-family:Arial,sans-serif;font-size:12px;font-weight:600;color:#091426;padding:4px 0;border-bottom:1px dotted #E2E8F0;">${NGO_PAN}</td></tr>
                </table>
              </td>
              <td width="50%" style="vertical-align:top;padding-left:12px;">
                <div style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#091426;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:8px;">Registered Address</div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:12px;color:#45474C;font-style:italic;line-height:1.4;">${NGO_ADDRESS}</div>
                <div style="font-family:Arial,sans-serif;font-size:11px;color:#45474C;margin-top:8px;">${NGO_CONTACT}</div>
              </td>
            </tr>
          </table>

          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:24px 24px 16px;">
            <tr>
              <td align="right">
                <table cellpadding="0" cellspacing="0" border="0" style="border-top:2px solid #091426;padding-top:8px;width:240px;">
                  <tr>
                    <td style="font-family:Georgia,'Times New Roman',serif;font-size:13px;font-weight:700;color:#091426;text-align:center;">Authorized Signatory</td>
                  </tr>
                  <tr>
                    <td style="font-family:Arial,sans-serif;font-size:9px;color:#75777D;text-align:center;letter-spacing:0.05em;text-transform:uppercase;">For Academic Expert Seva Trust</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:16px 24px;border-top:1px solid #E2E8F0;">
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:10px;color:#75777D;font-style:italic;">
                This is a computer-generated certificate and does not require a physical signature. All contributions to Academic Expert Seva Charitable Trust are tax-exempt under Section 80G of the Income Tax Act, 1961.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  ` : '';

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="background:#091426;padding:16px 24px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:700;color:#ffffff;">Academic Seva</td>
                <td align="right" style="font-family:Arial,sans-serif;font-size:10px;color:#BCC7DE;letter-spacing:0.1em;text-transform:uppercase;">Empowering Futures</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div style="background:#ffffff;border:1px solid #E2E8F0;border-top:0;padding:32px 24px;">
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#D97706;margin:0 0 8px;">Thank You for Your Kindness!</h1>
        ${donorName ? `<p style="font-size:15px;color:#171C1F;margin:0 0 16px;">Dear <strong>${donorName}</strong>,</p>` : ''}
        <p style="font-size:15px;color:#171C1F;margin:0 0 20px;line-height:1.5;">
          Your contribution of <strong>Rs. ${donationAmount}/-</strong> will directly help a student in need. Your generosity makes quality education, nutrition, and opportunity possible for those who need it most.
        </p>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F4F2ED;border-radius:8px;padding:20px;margin:20px 0;">
          <tr>
            <td style="padding-bottom:8px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:12px;color:#45474C;">Payment ID</td>
                  <td align="right" style="font-family:'Courier New',monospace;font-size:13px;font-weight:700;color:#091426;">${paymentId}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:12px;color:#45474C;padding-top:6px;">Amount</td>
                  <td align="right" style="font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#D97706;padding-top:6px;">Rs. ${donationAmount}/-</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:12px;color:#45474C;padding-top:6px;">Email</td>
                  <td align="right" style="font-family:Arial,sans-serif;font-size:13px;color:#091426;padding-top:6px;">${to}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:12px;color:#45474C;padding-top:6px;">Date</td>
                  <td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#091426;padding-top:6px;">${today}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        ${certSection}

        <p style="font-size:13px;color:#6B7280;margin:24px 0 0;line-height:1.4;">
          If you have any questions, simply reply to this email.<br/>
          <span style="color:#D97706;font-weight:700;">— Team Academic Seva</span>
        </p>
      </div>

      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="background:#091426;padding:24px;text-align:center;">
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:14px;font-weight:700;color:#ffffff;margin-bottom:8px;">Academic Seva</div>
            <div style="font-family:Arial,sans-serif;font-size:11px;color:#BCC7DE;line-height:1.5;">
              Your small act of kindness ignites a beacon of hope for children whose dreams are limited only by their circumstances.
            </div>
            <div style="font-family:Arial,sans-serif;font-size:9px;color:#8290A6;letter-spacing:0.05em;text-transform:uppercase;margin-top:16px;">
              ${NGO_ADDRESS} &bull; ${NGO_CONTACT}
            </div>
            <div style="font-family:Arial,sans-serif;font-size:10px;color:#8290A6;margin-top:12px;">
              &copy; 2026 Academic Seva. Registered NGO. All contributions are tax-exempt under Section 80G.
            </div>
          </td>
        </tr>
      </table>
    </div>
  `;
}

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
  let certNumber: string | undefined;

  if (taxExempt && donorName) {
    certNumber = generateCertificateNumber(paymentId);
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
  }

  await resend.emails.send({
    from: process.env.SENDER_EMAIL!,
    to,
    subject: taxExempt
      ? `Your 80G Certificate — ${certNumber || ''} — Academic Seva`
      : 'Thank You for Your Donation — Academic Seva',
    attachments: attachment ? [attachment] : undefined,
    html: emailBody({
      donorName,
      donationAmount,
      paymentId,
      to,
      certNumber,
      donorPan,
      taxExempt,
    }),
  });
}
