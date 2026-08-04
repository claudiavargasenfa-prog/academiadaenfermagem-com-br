// Correção automática de termos técnicos de enfermagem no texto ditado
// e interpretação dos comandos de voz. Tudo local, sem custo de IA.

type Regra = [RegExp, string];

const TERMOS: Regra[] = [
  [/\bdispin(e|é)ia\b/gi, "dispneia"],
  [/\bdisp(i|í)nea\b/gi, "dispneia"],
  [/\btaqui\s?card(i|í)a\b/gi, "taquicardia"],
  [/\bbradi\s?card(i|í)a\b/gi, "bradicardia"],
  [/\bhipo\s?tens(a|ã)o\b/gi, "hipotensão"],
  [/\bhiper\s?tens(a|ã)o\b/gi, "hipertensão"],
  [/\bsatura(c|ç)(a|ã)o\b/gi, "SatO₂"],
  [/\bsat\s*(o2|oh dois)?\s*(\d{2,3})\b/gi, "SatO₂ $2%"],
  [/\bsat\b/gi, "SatO₂"],
  [/\bf\s?c\s*(\d{2,3})\b/gi, "FC $1 bpm"],
  [/\bf\s?r\s*(\d{1,2})\b/gi, "FR $1 irpm"],
  [/\bp\s?a\s*(\d{2,3})\s*(por|x|\/)\s*(\d{2,3})\b/gi, "PA $1/$3 mmHg"],
  [/\bt\s?ax\s*(\d{2}[.,]?\d?)\b/gi, "Tax $1 °C"],
  [/\btemperatura\s*(\d{2}[.,]?\d?)\b/gi, "Tax $1 °C"],
  [/\bh\s?g\s?t\s*(\d{2,3})\b/gi, "HGT $1 mg/dL"],
  [/\bglicemia\s*(\d{2,3})\b/gi, "glicemia $1 mg/dL"],
  [/\bmmii\b/gi, "MMII"],
  [/\bmmss\b/gi, "MMSS"],
  [/\bmembros inferiores\b/gi, "MMII"],
  [/\bmembros superiores\b/gi, "MMSS"],
  [/\bescala de dor\s*(\d{1,2})\b/gi, "dor $1/10"],
  [/\bdor\s*(\d{1,2})\s*(de dez|\/\s*10)\b/gi, "dor $1/10"],
  [/\bacesso venoso perif(e|é)rico\b/gi, "acesso venoso periférico (AVP)"],
  [/\bsonda vesical de demora\b/gi, "sonda vesical de demora (SVD)"],
  [/\bsonda nasogastrica\b/gi, "sonda nasogástrica (SNG)"],
  [/\bcateter venoso central\b/gi, "cateter venoso central (CVC)"],
  [/\btraqueostomia\b/gi, "traqueostomia (TQT)"],
  [/\bulcera\b/gi, "úlcera"],
  [/\bedema em membros inferiores\b/gi, "edema em MMII"],
  [/\bn(a|á)useas?\b/gi, "náusea"],
  [/\bv(o|ô)mitos?\b/gi, "vômito"],
  [/\bcianose perif(e|é)rica\b/gi, "cianose periférica"],
  [/\bsudorese fria\b/gi, "sudorese fria"],
  [/\bglasgow\s*(\d{1,2})\b/gi, "Glasgow $1"],
  [/\bvirgula\b/gi, ","],
  [/\bponto final\b/gi, "."],
];

export function corrigirTermos(texto: string): string {
  let out = texto;
  for (const [re, rep] of TERMOS) out = out.replace(re, rep);
  out = out.replace(/\s+([,.;])/g, "$1").replace(/\s{2,}/g, " ").trim();
  if (out) out = out.charAt(0).toUpperCase() + out.slice(1);
  return out;
}

export type ComandoVoz =
  | "nova-linha"
  | "apagar-ultima"
  | "pausar"
  | "continuar"
  | "finalizar"
  | null;

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function detectarComando(texto: string): ComandoVoz {
  const t = norm(texto);
  if (!t) return null;
  if (/^(nova linha|paragrafo|novo paragrafo)$/.test(t)) return "nova-linha";
  if (/^(apagar ultima|apagar ultimo|apaga ultima|corrigir ultima)$/.test(t)) return "apagar-ultima";
  if (/^(pausar ditado|pausa ditado|pausar)$/.test(t)) return "pausar";
  if (/^(continuar ditado|retomar ditado|continuar)$/.test(t)) return "continuar";
  if (/^(finalizar ditado|encerrar ditado|parar ditado)$/.test(t)) return "finalizar";
  return null;
}
