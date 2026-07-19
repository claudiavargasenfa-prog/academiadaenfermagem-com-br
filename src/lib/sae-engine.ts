// Motor do SAE AUTOMÁTICA — usa o BANCO DE DADOS MESTRE (planilha oficial).
// Casa o texto de "Sinais e Sintomas" com os diagnósticos ADEC via
// TAB. 4 (Evidências Clínicas) + TAB. 13 (Palavras-chave).

import banco from "@/data/sae-banco.json";

export type SaeConduta = {
  conduta: string;
  horario: string;
  aprazamento: string;
  objetivo?: string;
  prioridade?: string;
  palavras?: string;
  obs?: string;
};
export type SaeDiagnostico = {
  id: string;
  matriz?: string;
  eixo?: string;
  sinais: string;                 // TAB. 4 — Evidências Clínicas
  criteriosEssenciais?: string;   // TAB. 5
  criteriosAssociados?: string;   // TAB. 6
  diagnostico: string;            // TAB. 7 — Hipótese Diagnóstica
  condutas: SaeConduta[];
  meta: string;
  raciocinio: string;
};

export const SAE_BANCO: SaeDiagnostico[] = banco as SaeDiagnostico[];

const STOP = new Set([
  "com","sem","por","para","dos","das","que","uma","umas","uns","não","nao",
  "como","aos","seu","sua","seus","suas","essa","esse","este","esta","risco",
  "aguda","paciente","nivel","grau","tipo","fisica","fisico","corporal",
  "corporais","associada","associado","possivel","alteracao","alteracoes",
  "ineficaz","prejudicada","prejudicado","presenca","perda","grande","pequeno",
  "padrao","instabilidade","alterada","alteradas","sinais","sintomas",
  "dificuldade","excesso","deficit","alto","baixa","baixo","fatores","funcional",
  "cronico","cronica","atrasada","severo","severa","intensa","intenso",
  "completa","clinica","clinico","assistencial","assistenciais","evidencias",
  "durante","quando","onde","ainda","muito","pouco","tambem",
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

// Índice pré-calculado: keywords vindas SOMENTE de TAB. 4 (sinais) + TAB. 13 (palavras).
const INDEX = SAE_BANCO.map((d) => {
  const kw = new Set<string>();
  tokens(d.sinais).forEach((t) => kw.add(t));
  d.condutas.forEach((c) => tokens(c.palavras || "").forEach((t) => kw.add(t)));
  const phrases = norm(d.sinais)
    .split(/[;.,]/)
    .map((p) => p.trim())
    .filter((p) => p.length >= 6);
  return { d, keywords: Array.from(kw), phrases };
});

export type SaeMatch = { diag: SaeDiagnostico; score: number; hits: string[] };

export function matchDiagnosticos(corpusRaw: string, maxResults = 15): SaeMatch[] {
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
    .map((c) => {
      const hor = c.horario ? ` <span style="color:#854d0e;font-weight:600;">[${esc(c.horario)}]</span>` : "";
      const apr = c.aprazamento ? ` <span style="color:#166534;font-weight:600;">(${esc(c.aprazamento)})</span>` : "";
      return `<li style="margin-bottom:4px;">${esc(c.conduta)}${hor}${apr}</li>`;
    })
    .join("");
  const objetivos = d.condutas.map((c) => c.objetivo).filter(Boolean);
  const prioridade = d.condutas.find((c) => c.prioridade)?.prioridade || "";
  const observ = d.condutas.map((c) => c.obs).filter(Boolean);
  const matrizChip = d.matriz
    ? `<span style="font-size:10.5px;background:#dcfce7;color:#14532d;padding:2px 8px;border-radius:4px;font-weight:600;">${esc(d.matriz)}${d.eixo ? " · " + esc(d.eixo) : ""}</span>`
    : "";
  return `
<div class="sae-diag-card" data-diag-id="${esc(d.id)}" style="background:#f0fdf4;border-radius:10px;padding:14px;border:1px solid #bbf7d0;border-left:5px solid #ca8a04;display:flex;align-items:flex-start;justify-content:space-between;gap:15px;">
  <div style="flex:1;">
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;flex-wrap:wrap;">
      <label style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:#14532d;cursor:pointer;">
        <input type="checkbox" class="sae-diag-select" data-diag-id="${esc(d.id)}" style="accent-color:#166534;width:16px;height:16px;"> Selecionar
      </label>
      <span style="font-size:11px;background:#fef08a;color:#854d0e;padding:2px 8px;border-radius:4px;font-weight:bold;">${esc(d.id)}</span>
      ${matrizChip}
    </div>
    <h4 style="margin:0 0 6px 0;font-size:14px;color:#14532d;font-weight:bold;line-height:1.4;">${esc(d.diagnostico)}</h4>
    <p style="margin:0 0 4px 0;font-size:12px;color:#4b5563;"><strong style="color:#166534;">Evidências Clínicas:</strong> ${esc(d.sinais)}</p>
    ${d.criteriosEssenciais ? `<p style="margin:0 0 4px 0;font-size:12px;color:#4b5563;"><strong style="color:#166534;">Critérios essenciais:</strong> ${esc(d.criteriosEssenciais)}</p>` : ""}
    ${d.criteriosAssociados ? `<p style="margin:0 0 6px 0;font-size:12px;color:#4b5563;"><strong style="color:#166534;">Critérios associados:</strong> ${esc(d.criteriosAssociados)}</p>` : ""}
    <details style="margin:4px 0;">
      <summary style="cursor:pointer;font-size:12px;color:#166534;font-weight:600;">Ver intervenções, objetivos e observações</summary>
      <div style="margin-top:6px;font-size:12px;color:#4b5563;">
        <p style="margin:0 0 4px 0;"><strong style="color:#166534;">Intervenções assistenciais:</strong></p>
        <ul style="margin:0 0 8px 18px;padding:0;">${condutasHtml}</ul>
        ${objetivos.length ? `<p style="margin:0 0 4px 0;"><strong style="color:#166534;">Objetivos:</strong> ${esc(objetivos.join(" • "))}</p>` : ""}
        ${prioridade ? `<p style="margin:0 0 4px 0;"><strong style="color:#166534;">Prioridade clínica:</strong> ${esc(prioridade)}</p>` : ""}
        ${observ.length ? `<p style="margin:0;"><strong style="color:#166534;">Observações:</strong> ${esc(observ.join(" • "))}</p>` : ""}
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
  // Texto corrido numerado com TAB. 9 (frequência) em negrito verde inline.
  const prescricaoTexto = d.condutas
    .map((c, i) => {
      const txt = esc(c.conduta).replace(/\s*\.?\s*$/, "");
      const hor = c.horario
        ? ` <strong style="color:#166534;">${esc(c.horario)}</strong>`
        : "";
      return `${i + 1}. ${txt}.${hor}`;
    })
    .join(" ");
  // APRAZAMENTO: exibe TAB. 10 (texto tal como vem da planilha).
  const aprazTextos = d.condutas
    .map((c) => (c.aprazamento || "").trim())
    .filter(Boolean);
  const uniqAprz = Array.from(new Set(aprazTextos));
  const aprazamentoTexto = uniqAprz.length
    ? uniqAprz.map((a) => esc(a)).join("<br/>")
    : `<span style="color:#166534;font-weight:700;letter-spacing:2px;">A T E N Ç Ã O</span>`;
  const pautado =
    "background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 27px, #86efac 27px, #86efac 28px); background-size: 100% 28px; min-height:170px;";
  return `
<tr class="sae-presc-row" data-diag-id="${esc(d.id)}" style="border-bottom:1px solid #86efac;background:#ffffff;">
  <td style="padding:12px 12px;line-height:1.55;vertical-align:top;border-right:1px solid #86efac;background:#ffffff;color:#14532d;font-size:13px;text-align:justify;">
    <div style="font-weight:700;color:#14532d;margin-bottom:6px;font-size:12px;">${esc(d.diagnostico)} <span style="font-size:10px;color:#166534;">(${esc(d.id)})</span>
      <button type="button" class="sae-presc-del" data-diag-id="${esc(d.id)}" title="Excluir este item" aria-label="Excluir item" style="float:right;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;font-weight:700;font-size:11px;padding:2px 8px;border-radius:6px;cursor:pointer;">✕ Excluir</button>
    </div>
    ${prescricaoTexto}
    <span class="sae-presc-num" style="display:none;">${numero}</span>
  </td>
  <td style="padding:12px 10px;vertical-align:top;border-right:1px solid #86efac;background:#ffffff;font-size:13px;color:#166534;font-weight:700;text-align:center;line-height:1.4;">${aprazamentoTexto}</td>
  <td style="padding:8px 8px;vertical-align:top;background:#ffffff;"><div style="width:100%;${pautado}"></div></td>
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
    .map((d, i) => `${i + 1}. ${d.diagnostico} (${d.id})${d.meta ? " — Meta: " + d.meta : ""}`)
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
    "DIAGNÓSTICOS DE ENFERMAGEM (ADEC):",
    dxLines || "• Nenhum diagnóstico selecionado.",
    "",
    "CONDUTA: Prescrição de enfermagem gerada conforme banco oficial ADEC.",
  ]
    .filter((l) => l !== null && l !== undefined)
    .join("\n");
}
