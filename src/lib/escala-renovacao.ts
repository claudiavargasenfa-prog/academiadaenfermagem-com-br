/** Oferta única de renovação: de 10/11 até 20/12 — de R$ 49,36 por R$ 37,97. */
export const PRECO_CHEIO = "R$ 49,36";
export const PRECO_OFERTA = "R$ 37,97";
export function avisoRenovacao(now: Date): { ano: number } | null {
  const m = now.getMonth(), d = now.getDate();
  if ((m === 10 && d >= 10) || (m === 11 && d <= 20)) return { ano: now.getFullYear() + 1 };
  return null;
}

/** Escala só aceita edição com pagamento confirmado vigente (ou admin). */
export function escalaBloqueada(now: Date, expiresAt: string | null, admin: boolean): boolean {
  if (admin) return false;
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() < now.getTime();
}
