'use client';

import type { CertData } from '@/lib/token';

const NGO_NAME = 'Academic Expert Seva Charitable Trust';
const NGO_80G_REG = 'AALTA7396J';
const NGO_PAN = 'AALTA7396J';
const NGO_REG_NO = 'KA/2025/0708089';
const NGO_ADDRESS = 'Vinayaka Layout, 4th Cross, Doddanagamangala Rd, Naganathapura, Rayasandra, Bengaluru, Karnataka – 560100';
const NGO_CONTACT = '+91 9964891777 / +91 9538693555';

export default function CertificateView({ data, token }: { data: CertData; token: string }) {
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = `/api/certificate-pdf?token=${encodeURIComponent(token)}`;
    a.download = `80G_Certificate_${data.certNumber.replace(/\//g, '_')}.pdf`;
    a.click();
  };

  return (
    <main className="min-h-screen py-12 px-4 md:px-0 bg-surface-container-low flex flex-col items-center">
      <button
        onClick={handleDownload}
        className="fixed top-4 right-4 z-50 bg-hope-amber text-white font-label-caps text-label-caps py-3 px-6 rounded-lg hover:brightness-110 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
      >
        <span className="text-lg">↓</span> DOWNLOAD PDF
      </button>

      <div className="bg-white w-full max-w-[800px] shadow-xl border border-outline-variant relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 opacity-[0.04] pointer-events-none z-0 text-[8rem] font-black whitespace-nowrap select-none font-headline-xl" style={{ fontFamily: 'Georgia, serif' }}>
          ACADEMIC SEVA
        </div>

        {/* Header Bar */}
        <div className="bg-primary text-on-primary w-full p-8 flex justify-between items-center z-10 relative">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-bold tracking-tight">{NGO_NAME}</h2>
            <p className="font-label-caps text-label-caps opacity-80 mt-1 uppercase tracking-widest">
              Empowering Futures Through Education
            </p>
          </div>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <span className="text-primary text-[40px] font-bold">AS</span>
          </div>
        </div>

        {/* Certificate Content */}
        <div className="px-12 py-10 text-center z-10 relative">
          <h3 className="font-headline-lg text-headline-lg text-primary border-b-2 border-hope-amber inline-block pb-1 mb-8 uppercase">
            80G Tax Exemption Certificate
          </h3>

          <div className="flex justify-between w-full font-label-caps text-label-caps text-on-surface-variant mb-12">
            <div className="text-left">
              <p className="mb-1">CERTIFICATE NO:</p>
              <p className="text-primary font-bold text-[14px]">{data.certNumber}</p>
            </div>
            <div className="text-right">
              <p className="mb-1">DATE OF ISSUE:</p>
              <p className="text-primary font-bold text-[14px]">{today}</p>
            </div>
          </div>

          {/* Recipient Declaration */}
          <div className="text-left space-y-stack-lg mb-12">
            <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
              This is to certify that{' '}
              <span className="font-bold text-primary border-b border-outline-variant px-2">{data.name}</span>
              {' '}has generously contributed to the causes supported by {NGO_NAME}.
            </p>
            {data.pan && (
              <div className="flex items-center gap-4">
                <span className="font-label-caps text-label-caps bg-surface-container-high px-3 py-1 rounded">
                  PAN NUMBER
                </span>
                <span className="font-headline-lg text-headline-lg-mobile text-primary tracking-widest">
                  {data.pan}
                </span>
              </div>
            )}
          </div>

          {/* Donation Details Box */}
          <div className="bg-surface-warm border border-outline-variant p-8 rounded-lg text-left mb-12">
            <h4 className="font-label-caps text-label-caps text-secondary mb-6">
              DONATION SUMMARY
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">Payment ID</p>
                <p className="font-body-md text-primary font-bold break-all">{data.paymentId}</p>
              </div>
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">Amount Donated</p>
                <p className="font-headline-lg text-headline-lg-mobile text-hope-amber">Rs. {data.amount}/-</p>
              </div>
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">Contribution Date</p>
                <p className="font-body-md text-primary font-bold">{today}</p>
              </div>
            </div>
          </div>

          {/* Trust Details & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left mb-16 pt-8 border-t border-outline-variant">
            <div>
              <h5 className="font-label-caps text-label-caps text-primary font-bold mb-4">TRUST DETAILS</h5>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-outline-variant border-dotted pb-1">
                  <span className="font-body-md text-body-md text-on-surface-variant">Registration No:</span>
                  <span className="font-body-md text-body-md text-primary font-medium">{NGO_REG_NO}</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant border-dotted pb-1">
                  <span className="font-body-md text-body-md text-on-surface-variant">80G Registration:</span>
                  <span className="font-body-md text-body-md text-primary font-medium">{NGO_80G_REG}</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant border-dotted pb-1">
                  <span className="font-body-md text-body-md text-on-surface-variant">Trust PAN:</span>
                  <span className="font-body-md text-body-md text-primary font-medium">{NGO_PAN}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="font-label-caps text-label-caps text-primary font-bold mb-4">REGISTERED ADDRESS</h5>
              <p className="font-body-md text-body-md text-on-surface-variant italic">{NGO_ADDRESS}</p>
              <div className="pt-2 flex gap-4 text-[13px] text-on-surface-variant">
                <span className="text-hope-amber">{NGO_CONTACT}</span>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="flex justify-end mt-12 mb-8">
            <div className="text-center w-64">
              <div className="border-t-2 border-primary pt-2">
                <p className="font-label-caps text-label-caps text-primary font-bold">Authorized Signatory</p>
                <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                  For Academic Expert Seva Trust
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="pt-10 border-t border-outline-variant">
            <p className="font-body-md text-[12px] text-on-surface-variant italic">
              This is a computer-generated certificate and does not require a physical signature. All contributions to
              Academic Expert Seva Charitable Trust are tax-exempt under Section 80G of the Income Tax Act, 1961.
            </p>
          </div>
        </div>
      </div>

      <footer className="w-full max-w-[800px] mt-20 text-center bg-primary text-on-primary p-8 rounded-lg">
        <h4 className="font-headline-lg-mobile text-headline-lg-mobile font-bold">Academic Seva</h4>
        <p className="font-body-md text-body-md max-w-2xl mx-auto opacity-80 mt-2">
          Your small act of kindness ignites a beacon of hope for children whose dreams are limited only by their circumstances.
        </p>
        <p className="font-label-caps text-label-caps text-on-tertiary-container mt-8">
          © 2026 Academic Seva. Registered NGO. All contributions are tax-exempt.
        </p>
      </footer>
    </main>
  );
}
