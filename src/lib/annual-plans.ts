export const ANNUAL_DAYS = 365;
export const ANNUAL_PLANS = {
  'tecnico-estudante': { name: 'Academia do Estudante de Técnico em Enfermagem', cents: 3799 },
  tecnico: { name: 'Academia do Técnico em Enfermagem', cents: 5799 },
  academico: { name: 'Academia do Acadêmico em Enfermagem', cents: 7799 },
  enfermeiro: { name: 'Academia do Enfermeiro', cents: 9799 },
} as const;
export function isAnnualPlan(slug: string): slug is keyof typeof ANNUAL_PLANS { return Object.hasOwn(ANNUAL_PLANS, slug); }
export function annualExpiry(approved: string, current?: string): string {
  const start = Math.max(new Date(approved).getTime(), current ? new Date(current).getTime() : 0);
  return new Date(start + ANNUAL_DAYS * 86400000).toISOString();
}
export function validAnnualPayment(payment: { transaction_amount?: number; currency_id?: string; external_reference?: string; collector_id?: number }, order: { id: string; amount_cents: number }, collector: number): boolean {
  return payment.external_reference === order.id && payment.currency_id === 'BRL' && payment.collector_id === collector && Number.isFinite(payment.transaction_amount) && Math.round((payment.transaction_amount ?? 0) * 100) === order.amount_cents;
}
