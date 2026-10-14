import { describe, expect, test } from 'vitest';
import { ANNUAL_PLANS, annualExpiry, validAnnualPayment, isAnnualPlan } from './annual-plans';
describe('ofertas anuais aprovadas', () => {
 test('estudante técnico custa R$37,99', () => expect(ANNUAL_PLANS['tecnico-estudante'].cents).toBe(3799));
 test('técnico custa R$57,99', () => expect(ANNUAL_PLANS.tecnico.cents).toBe(5799));
 test('acadêmico custa R$77,99', () => expect(ANNUAL_PLANS.academico.cents).toBe(7799));
 test('enfermeiro custa R$97,99', () => expect(ANNUAL_PLANS.enfermeiro.cents).toBe(9799));
 test('acesso dura exatamente 365 dias', () => expect(annualExpiry('2026-10-11T05:00:00Z')).toBe('2027-10-11T05:00:00.000Z'));
 test('renovação acrescenta 365 dias ao vencimento vigente', () => expect(annualExpiry('2026-10-11T05:00:00Z','2027-01-01T05:00:00Z')).toBe('2028-01-01T05:00:00.000Z'));
 test('não vende outra academia como uma das quatro', () => expect(isAnnualPlan('uti-emergencia')).toBe(false));
 test('pagamento deve coincidir com pedido, valor, moeda e recebedor', () => {
  const p = {transaction_amount:37.99,currency_id:'BRL',external_reference:'order',collector_id:123};
  const o = {id:'order',amount_cents:3799};
  expect(validAnnualPayment(p,o,123)).toBe(true);
  expect(validAnnualPayment({...p,transaction_amount:1},o,123)).toBe(false);
  expect(validAnnualPayment({...p,currency_id:'USD'},o,123)).toBe(false);
  expect(validAnnualPayment({...p,external_reference:'other'},o,123)).toBe(false);
  expect(validAnnualPayment(p,o,999)).toBe(false);
 });
});
