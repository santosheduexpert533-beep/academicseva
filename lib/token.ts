import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function getKey(): Buffer {
  const secret = process.env.CERTIFICATE_SECRET;
  if (!secret) throw new Error('CERTIFICATE_SECRET not set');
  return crypto.createHash('sha256').update(secret).digest();
}

export type CertData = {
  name: string;
  pan: string;
  paymentId: string;
  amount: number;
  certNumber: string;
  email: string;
};

export function encryptCertData(data: CertData): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const plain = Buffer.from(JSON.stringify(data), 'utf-8');
  const encrypted = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();
  const combined = Buffer.concat([iv, tag, encrypted]);
  return combined.toString('base64url');
}

export function decryptCertToken(token: string): CertData | null {
  try {
    const combined = Buffer.from(token, 'base64url');
    if (combined.length < IV_LENGTH + TAG_LENGTH) return null;
    const iv = combined.subarray(0, IV_LENGTH);
    const tag = combined.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = combined.subarray(IV_LENGTH + TAG_LENGTH);
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return JSON.parse(plain.toString('utf-8'));
  } catch {
    return null;
  }
}
