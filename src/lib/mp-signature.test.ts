import { createHmac } from 'crypto';
import { describe, expect, test } from 'vitest';
import { verifyMpSignature } from './mp-signature';

describe('confirmação assinada do Mercado Pago', () => {
  const secret = 'test-only-signing-key';
  const ts = '1791690000';
  const hash = createHmac('sha256', secret).update(`id:123;request-id:request;ts:${ts};`).digest('hex');
  const signature = `ts=${ts},v1=${hash}`;
  test('aceita somente a assinatura do pedido recebido', () => {
    expect(verifyMpSignature(secret, signature, 'request', '123')).toBe(true);
    expect(verifyMpSignature(secret, signature, 'request', '124')).toBe(false);
    expect(verifyMpSignature(secret, signature, 'another-request', '123')).toBe(false);
    expect(verifyMpSignature('wrong-key', signature, 'request', '123')).toBe(false);
  });
  test('não aceita uma confirmação sem assinatura válida', () => {
    expect(verifyMpSignature(secret, null, 'request', '123')).toBe(false);
    expect(verifyMpSignature(secret, `ts=${ts},v1=invalid`, 'request', '123')).toBe(false);
  });
});