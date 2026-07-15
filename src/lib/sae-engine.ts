// Motor do SAE AUTOMÁTICA — usa o BANCO DE DADOS MESTRE (planilha da usuária).
// Casa sinais/sintomas digitados + achados marcados com os 37 diagnósticos
// autorais e monta a prescrição e a evolução consolidada.

import banco from "@/data/sae-banco.json";

export type SaeConduta = { conduta: string; horario: string; aprazamento: string };
export type SaeDiagnostico = {
  id: string;
  sinais: string;
  diagnostico: string;
  condutas: SaeConduta[];
  meta: string;
  raciocinio: string;
};

export const SAE_BANCO: SaeDiagnostico[] = banco as SaeDiagnostico[];

const STOP = new Set([
  "com","sem","por","para","dos","das","dos","que","uma","umas","uns","não",
  "nao","como","aos","seu","sua","seus","suas","essa","esse","este","esta",
  "risco","aguda","aguda","paciente","nivel","grau","tipo","fisica","fisico",
  "corporal","corporais","associada","associado","possivel","alteracao",
  "alteracoes","ineficaz","prejudicada","prejudicado","presenca","perda",
  "grande","pequeno","padrao","instabilidade","alterada","alteradas","risco",
  "sinais","sintomas","dificuldade","excesso","deficit","alto","baixa","baixo",
  "fatores","funcional","funcional","cronico","cronica","atrasada","severo",
  "severa","intensa","intenso","aguda","cronico","cronica","completa",
]);

function norm(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function tokens(s: string, minLen = 5): string[] {
  return norm(s)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= minLen && !STOP.has(t));
}

// Índice pré-calculado: para cada diagnóstico, keywords vindas de sinais + título.
const INDEX = SAE_BANCO.map((d) => {
  const kw = new Set<string>();
  tokens(d.sinais).forEach((t) => kw.add(t));
  tokens(d.diagnostico).forEach((t) => kw.add(t));
  // frases inteiras (para casar "dor no peito", "trabalho de parto", etc.)
  const phrases = norm(d.sinais)
    .split(/[;.,]/)
    .map((p) => p.trim())
    .filter((p) => p.length >= 6);
  return { d, keywords: Array.from(kw), phrases };
});

export type SaeMatch = { diag: SaeDiagnostico; score: number; hits: string[] };

export function matchDiagnosticos(corpusRaw: string, maxResults = 12): SaeMatch[] {
  const corpus = norm(corpusRaw);
  if (!corpus.trim()) return [];
  const results: SaeMatch[] = [];
  for (const { d, keywords, phrases } of INDEX) {
    const hits: string[] = [];
    let score = 0;
    for (const p of phrases) {
      if (p.length >= 8 && corpus.includes(p)) {
        score += 3;
        hits.push(p);
      }
    }
    for (const k of keywords) {
      // \b não funciona bem com números; usa regex word-boundary básico
      const re = new RegExp(`(^|[^a-z0-9])${k}([^a-z0-9]|$)`);
      if (re.test(corpus)) {
        score += 1;
        hits.push(k);
      }
    }
    if (score > 0) results.push({ diag: d, score, hits });
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}

// ---------- HTML helpers ----------

function esc(s: string): string {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderDiagnosticoCard(m: SaeMatch, idx: number): string {
  const d = m.diag;
  const condutasHtml = d.condutas
    .map(
      (c) =>
        `<li style="margin-bottom:4px;">${esc(c.conduta)} <span style="color:#854d0e;font-weight:600;">[${esc(c.horario || "—")}]</span></li>`,
    )
    .join("");
  return `
<div class="sae-diag-card" data-diag-id="${esc(d.id)}" style="background:#f0fdf4;border-radius:10px;padding:14px;border:1px solid #bbf7d0;border-left:5px solid #ca8a04;display:flex;align-items:flex-start;justify-content:space-between;gap:15px;">
  <div style="flex:1;">
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;flex-wrap:wrap;">
      <label style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:#14532d;cursor:pointer;">
        <input type="checkbox" class="sae-diag-select" data-diag-id="${esc(d.id)}" style="accent-color:#166534;width:16px;height:16px;"> Selecionar
      </label>
      <span style="font-size:11px;background:#fef08a;color:#854d0e;padding:2px 8px;border-radius:4px;font-weight:bold;">${esc(d.id)}</span>
    </div>
    <h4 style="margin:0 0 6px 0;font-size:14px;color:#14532d;font-weight:bold;line-height:1.4;">${esc(d.diagnostico)}</h4>
    <p style="margin:0 0 6px 0;font-size:12px;color:#4b5563;"><strong style="color:#166534;">Sinais/Sintomas:</strong> ${esc(d.sinais)}</p>
    <details style="margin:4px 0;">
      <summary style="cursor:pointer;font-size:12px;color:#166534;font-weight:600;">Ver condutas (CDE), meta e raciocínio</summary>
      <div style="margin-top:6px;font-size:12px;color:#4b5563;">
        <p style="margin:0 0 4px 0;"><strong style="color:#166534;">Condutas (CDE):</strong></p>
        <ul style="margin:0 0 8px 18px;padding:0;">${condutasHtml}</ul>
        <p style="margin:0 0 4px 0;"><strong style="color:#166534;">Meta (MM):</strong> ${esc(d.meta)}</p>
        <p style="margin:0;"><strong style="color:#166534;">Raciocínio (RC):</strong> ${esc(d.raciocinio)}</p>
      </div>
    </details>
  </div>
  <div style="text-align:center;flex-shrink:0;">
    <label style="display:block;font-size:10.5px;font-weight:bold;color:#166534;margin-bottom:4px;">Prioridade:</label>
    <input type="number" class="sae-diag-prio" data-diag-id="${esc(d.id)}" min="1" max="20" placeholder="${idx + 1}" style="width:56px;padding:6px;border:2px solid #fef08a;border-radius:6px;text-align:center;font-size:14px;font-weight:bold;color:#14532d;background:#ffffff;outline:none;box-sizing:border-box;">
  </div>
</div>`;
}

export function renderPrescricaoRow(
  d: SaeDiagnostico,
  numero: number,
): string {
  // Texto corrido: junta todas as condutas em uma sequência, com horário inline em dourado.
  const prescricaoTexto = d.condutas
    .map(
      (c) =>
        `${esc(c.conduta).replace(/\s*\.?\s*$/, "")}.${c.horario ? ` <span style="color:#854d0e;font-weight:700;">${esc(c.horario)}</span>` : ""}`,
    )
    .join(" ");
  const aprazamentoTexto = d.condutas
    .map((c) => {
      const apr = (c.aprazamento || "").trim();
      const hor = (c.horario || "").trim();
      if (!apr && !hor) return "";
      return `${hor ? `De ${esc(hor)}` : ""}${apr ? ` <span style="color:#166534;font-weight:700;">(${esc(apr)})</span>` : ""}`;
    })
    .filter(Boolean)
    .join(" · ");
  const pautado =
    "background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 23px, #cbd5e1 23px, #cbd5e1 24px); background-size: 100% 24px; min-height:180px;";
  return `
<tr class="sae-presc-row" data-diag-id="${esc(d.id)}" style="border-bottom:3px solid #ca8a04;background:#ffffff;">
  <td style="padding:14px 10px;text-align:center;font-weight:bold;color:#14532d;vertical-align:top;border-right:1px solid #fde68a;font-size:16px;background:#ffffff;">
    <span class="sae-presc-num">${numero}</span>
    <button type="button" class="sae-presc-del" data-diag-id="${esc(d.id)}" title="Excluir este item" aria-label="Excluir item" style="display:block;margin:8px auto 0;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;font-weight:700;font-size:11px;padding:4px 8px;border-radius:6px;cursor:pointer;">✕ Excluir</button>
  </td>
  <td style="padding:14px 10px;line-height:1.6;vertical-align:top;border-right:1px solid #fde68a;background:#ffffff;">
    <div style="font-weight:700;color:#14532d;margin-bottom:8px;font-size:13px;">${esc(d.diagnostico)} <span style="font-size:10px;color:#854d0e;">(${esc(d.id)})</span></div>
    <p style="margin:0;font-size:13px;color:#14532d;text-align:justify;">${prescricaoTexto}</p>
  </td>
  <td style="padding:14px 10px;vertical-align:top;border-right:1px solid #fde68a;background:#ffffff;font-size:13px;color:#14532d;line-height:1.6;">${aprazamentoTexto || "—"}</td>
  <td style="padding:14px 10px;vertical-align:top;background:#ffffff;"><div style="width:100%;${pautado}"></div></td>
</tr>`;
}

export function buildEvolucao(params: {
  identificacao: Record<string, string>;
  anamneseCheckLabels: string[];
  exameFisicoCheckLabels: string[];
  sintomasLivres: string;
  diagnosticosSelecionados: SaeDiagnostico[];
}): string {
  const { identificacao, anamneseCheckLabels, exameFisicoCheckLabels, sintomasLivres, diagnosticosSelecionados } = params;
  const dt = new Date().toLocaleString("pt-BR");
  const ident = Object.entries(identificacao)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}: ${v.trim()}`)
    .join(" | ");
  const dxLines = diagnosticosSelecionados
    .map((d, i) => `${i + 1}. ${d.diagnostico} (${d.id}) — Meta: ${d.meta}`)
    .join("\n");
  return [
    `EVOLUÇÃO CLÍNICA DE ENFERMAGEM — ${dt}`,
    "---------------------------------------------------------------",
    ident ? `IDENTIFICAÇÃO: ${ident}` : "",
    "",
    "ANAMNESE / ANTECEDENTES:",
    anamneseCheckLabels.length ? anamneseCheckLabels.map((l) => `• ${l}`).join("\n") : "• Sem antecedentes marcados.",
    "",
    "EXAME FÍSICO (achados marcados):",
    exameFisicoCheckLabels.length ? exameFisicoCheckLabels.map((l) => `• ${l}`).join("\n") : "• Sem achados marcados.",
    "",
    "SINAIS E SINTOMAS INFORMADOS:",
    sintomasLivres.trim() || "• Nenhum sintoma livre informado.",
    "",
    "DIAGNÓSTICOS DE ENFERMAGEM (AE/DE):",
    dxLines || "• Nenhum diagnóstico selecionado.",
    "",
    "CONDUTA: Prescrição de enfermagem gerada conforme banco de dados mestre AE/DE.",
  ]
    .filter((l) => l !== null && l !== undefined)
    .join("\n");
}
