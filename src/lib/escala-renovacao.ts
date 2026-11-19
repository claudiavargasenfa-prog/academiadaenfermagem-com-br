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

/** Teste gratuito para qualquer membro conectado até 20/12/2026 (fim do dia). */
export const FIM_TESTE = new Date(2026, 11, 20, 23, 59, 59);
export function testeAtivo(now: Date): boolean { return now.getTime() <= FIM_TESTE.getTime(); }
export function avisoTeste(now: Date): string {
  const dias = Math.ceil((new Date(2026, 11, 20).getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86400000);
  if (dias === 0) return "🚨 Hoje é o último dia do seu teste gratuito! Garanta agora para não perder a edição dos seus plantões em 2027.";
  if (dias === 1) return "⚠️ Seu acesso gratuito vai até amanhã! Gostou? Clique e adquira para usar o ano todo — valor único de R$ 37,97.";
  if (dias <= 4) return `⏳ Atenção: seu teste gratuito termina em ${dias} dias! Garanta sua Escala de 2027 por R$ 37,97.`;
  return "🎁 Você está usando o teste gratuito da Escala Inteligente até 20/12/2026! Garanta 2027 por apenas R$ 37,97.";
}
