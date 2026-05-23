import { decryptCertToken } from '@/lib/token';
import CertificateView from './certificate-view';
import { notFound } from 'next/navigation';

const EXPIRY_MINUTES = 30;

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = decryptCertToken(token);

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-surface-container-low px-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl border border-outline-variant text-center">
          <span className="material-symbols-outlined text-hope-amber text-5xl mb-4 block">link_off</span>
          <h1 className="font-headline-lg text-headline-lg text-slate-deep mb-4">Certificate Not Found</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">
            This certificate link is invalid or has expired. Certificate links are valid for{' '}
            <strong>{EXPIRY_MINUTES} minutes</strong> after issuance.
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            If you need a copy of your certificate, please contact us and we will assist you.
          </p>
          <p className="font-body-md text-body-md text-hope-amber mt-6 font-bold">
            — Team Academic Seva
          </p>
        </div>
      </main>
    );
  }

  return <CertificateView data={data} token={token} />;
}
