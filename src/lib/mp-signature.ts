import { createHmac, timingSafeEqual } from 'crypto';
export function verifyMpSignature(secret: string, signature: string | null, requestId: string | null, dataId: string): boolean {
 if (!signature || !requestId || !dataId) return false;
 const fields = Object.fromEntries(signature.split(',').map(p => p.trim().split('=')));
 const ts=fields['ts'], v1=fields['v1'];
 if (!ts || !v1 || !/^\d+$/.test(ts) || !/^[a-f0-9]{64}$/i.test(v1)) return false;
 const expected=createHmac('sha256',secret).update(`id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`).digest('hex');
 return timingSafeEqual(Buffer.from(expected,'hex'),Buffer.from(v1,'hex'));
}
