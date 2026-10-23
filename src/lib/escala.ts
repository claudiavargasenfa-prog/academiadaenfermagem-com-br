// Regras da Escala Automática de Plantão (gera turnos do ano inteiro).
export type Padrao = "12x36-d" | "12x36-n" | "12x60" | "24x72" | "24x120" | "24x144" | "d30" | "d40";

export const PADROES: Record<Padrao, { label: string; ciclo: number; horas: number; diarista?: boolean }> = {
  "12x36-d": { label: "12x36 — Diurno", ciclo: 2, horas: 12 },
  "12x36-n": { label: "12x36 — Noturno", ciclo: 2, horas: 12 },
  "12x60": { label: "12x60", ciclo: 3, horas: 12 },
  "24x72": { label: "24x72", ciclo: 4, horas: 24 },
  "24x120": { label: "24x120", ciclo: 6, horas: 24 },
  "24x144": { label: "24x144", ciclo: 7, horas: 24 },
  d30: { label: "Diarista — 30 h semanais", ciclo: 1, horas: 6, diarista: true },
  d40: { label: "Diarista — 40 h semanais", ciclo: 1, horas: 8, diarista: true },
};

export const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function parseIso(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Datas de trabalho por 365 dias a partir do primeiro plantão. */
export function gerarDatas(inicio: string, padrao: Padrao, dias = 365): string[] {
  const p = PADROES[padrao];
  const start = parseIso(inicio);
  const out: string[] = [];
  for (let i = 0; i < dias; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    if (p.diarista) {
      const w = d.getDay();
      if (w >= 1 && w <= 5) out.push(iso(d));
    } else if (i % p.ciclo === 0) out.push(iso(d));
  }
  return out;
}

/** Conflito quando dois vínculos diferentes trabalham no mesmo dia. */
export function conflitos(turnos: { data: string; vinculo: string }[]): string[] {
  const por = new Map<string, Set<string>>();
  for (const t of turnos) {
    if (!por.has(t.data)) por.set(t.data, new Set());
    por.get(t.data)!.add(t.vinculo);
  }
  return [...por].filter(([, s]) => s.size > 1).map(([d]) => d).sort();
}

export function media(notas: number[]) {
  const v = notas.filter((n) => !Number.isNaN(n));
  return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : 0;
}
