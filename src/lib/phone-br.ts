// Validação de celular brasileiro (DDD válido + 9 dígitos, sem números falsos)

export const DDDS_VALIDOS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export function onlyDigits(v: string): string {
  return (v || "").replace(/\D/g, "");
}

export function formatPhoneBR(v: string): string {
  const digits = onlyDigits(v).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function isSequencial(s: string): boolean {
  let cresc = true;
  let decresc = true;
  for (let i = 1; i < s.length; i++) {
    const a = Number(s[i - 1]);
    const b = Number(s[i]);
    if (b !== a + 1) cresc = false;
    if (b !== a - 1) decresc = false;
  }
  return cresc || decresc;
}

/** Retorna null quando o celular é válido; caso contrário, a mensagem de erro. */
export function validatePhoneBR(v: string): string | null {
  const d = onlyDigits(v);
  if (!d) return "Informe seu celular com DDD.";
  if (d.length !== 11) return "Celular incompleto. Use (DDD) 9XXXX-XXXX.";

  const ddd = Number(d.slice(0, 2));
  if (!DDDS_VALIDOS.has(ddd)) return "DDD inválido. Confira os dois primeiros números.";

  const numero = d.slice(2);
  if (numero[0] !== "9") return "Informe um celular (o número deve começar com 9 após o DDD).";

  if (/^(\d)\1+$/.test(numero)) return "Esse número não parece real. Informe seu celular ativo.";
  if (isSequencial(numero.slice(1)))
    return "Esse número não parece real. Informe seu celular ativo.";

  return null;
}
