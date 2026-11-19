/** Aviso de renovação: 10 a 30/11 → 30%; 1 a 20/12 → 20%; fora disso, nenhum. */
export function avisoRenovacao(now: Date): { desconto: 30 | 20; ano: number } | null {
  const m = now.getMonth(), d = now.getDate();
  if (m === 10 && d >= 10) return { desconto: 30, ano: now.getFullYear() + 1 };
  if (m === 11 && d <= 20) return { desconto: 20, ano: now.getFullYear() + 1 };
  return null;
}

/** Escala só aceita edição com pagamento confirmado vigente (ou admin). */
export function escalaBloqueada(now: Date, expiresAt: string | null, admin: boolean): boolean {
  if (admin) return false;
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() < now.getTime();
}
