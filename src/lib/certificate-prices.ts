// Taxa administrativa de emissão, registro e validação digital (oferta "De... Por...").
export const CERTIFICATE_PRICES: Record<number, { fromCents: number; cents: number }> = {
  10: { fromCents: 3500, cents: 1800 },
  20: { fromCents: 6500, cents: 3600 },
  30: { fromCents: 9500, cents: 5400 },
  40: { fromCents: 13000, cents: 6990 },
};

export function certificatePriceCents(hours: number): number | null {
  return CERTIFICATE_PRICES[hours]?.cents ?? null;
}

export const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
